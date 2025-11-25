import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { MODEL } from '../types/model_types';
import { RunnableSequence } from '@langchain/core/runnables';
import { new_planner_output_schema, old_planner_output_schema } from './schema';
import Tool from '../tools/tool';
import {
    new_chat_coder_prompt,
    new_chat_planner_prompt,
    old_chat_coder_prompt,
    old_chat_planner_prompt,
} from './prompts';
import { AIMessageChunk, MessageStructure } from '@langchain/core/messages';
import StreamParser from '../../services/stream_parser';
import { ChatRole, Message, prisma } from '@repo/database';
import GeneratorShape from '../../metadata/generator';
import { Response } from 'express';
import {
    FILE_STRUCTURE_TYPES,
    PHASE_TYPES,
    StreamEvent,
    StreamEventData,
} from '../../types/stream_event_types';
import { STAGE } from '../../types/content_types';
import { objectStore } from '../../services/init';
import { FileContent } from '@repo/types';
import { mergeWithLLMFiles, prepareBaseTemplate } from '../../class/test';

type planner = RunnableSequence<
    {
        user_instruction: string;
        idl?: Object[];
    },
    {
        should_continue: boolean;
        plan: string;
        contract_name?: string;
        context: string;
        files_likely_affected: {
            do: 'create' | 'update' | 'delete';
            file_path: string;
            what_to_do: string;
        }[];
    }
>;

type coder = RunnableSequence<
    {
        plan: any;
        files_likely_affected: any;
    },
    AIMessageChunk<MessageStructure>
>;

export default class Generator extends GeneratorShape {
    protected gemini_planner: ChatGoogleGenerativeAI;
    protected gemini_coder: ChatGoogleGenerativeAI;
    protected claude_coder: ChatAnthropic;
    protected parsers: Map<string, StreamParser>;

    constructor() {
        super();
        this.gemini_planner = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            temperature: 0.2,
        });
        this.gemini_coder = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            streaming: true,
            temperature: 0.2,
        });
        this.claude_coder = new ChatAnthropic({
            model: 'claude-sonnet-4-5-20250929',
            streaming: true,
        });
        this.parsers = new Map<string, StreamParser>();
    }

    public generate(
        res: Response,
        chat: 'new' | 'old',
        user_instruction: string,
        model: MODEL,
        contract_id: string,
        idl?: Object[],
    ) {
        console.log('generate contract hit');
        const parser = this.get_parser(contract_id, res);
        try {
            this.create_stream(res);

            console.log('gen.generator is called');
            const { planner_chain, coder_chain } = this.get_chains(chat, model);
            this.new_contract(
                res,
                planner_chain,
                coder_chain,
                user_instruction,
                contract_id,
                parser,
            );
        } catch (error) {
            console.error('Error while generating: ', Error);
            parser.reset();
            this.delete_parser(contract_id);
            res.end();
        }
    }

    protected async new_contract(
        res: Response,
        planner_chain: planner,
        coder_chain: any,
        user_instruction: string,
        contract_id: string,
        parser: StreamParser,
    ) {
        try {
            console.log('generate new contract hit');
            const planner_data = await planner_chain.invoke({
                user_instruction,
            });
            let full_response: string = '';

            console.log(planner_data);

            const llm_message = await prisma.message.create({
                data: {
                    content: planner_data.context,
                    contractId: contract_id,
                    role: ChatRole.AI,
                },
            });

            this.send_sse(res, STAGE.CONTEXT, {
                context: planner_data.context,
                llmMessage: llm_message,
            });

            if (!planner_data.should_continue) {
                console.log('planner said to not continue.');
                return;
            }

            const result = await prisma.$transaction(async (tx) => {
                const system_message = await tx.message.create({
                    data: {
                        contractId: contract_id,
                        role: ChatRole.SYSTEM,
                        content: 'starting to generate in a few seconds',
                        planning: true,
                    },
                });
                const update_contract = await tx.contract.update({
                    where: {
                        id: contract_id,
                    },
                    data: {
                        title: planner_data.contract_name,
                    },
                });

                return {
                    system_message,
                    contract: update_contract,
                };
            });

            // send planning stage from here
            this.send_sse(res, STAGE.PLANNING, { stage: 'Planning' }, result.system_message);

            const code_stream = await coder_chain.stream({
                plan: planner_data.plan,
                files_likely_affected: planner_data.files_likely_affected,
            });

            for await (const chunk of code_stream) {
                if (chunk.text) {
                    parser.feed(chunk.text, result.system_message);
                    full_response += chunk.text;
                }
            }

            const llm_generated_files: FileContent[] = parser.getGeneratedFiles();
            const base_files: FileContent[] = prepareBaseTemplate(planner_data.contract_name!);
            const final_code = mergeWithLLMFiles(base_files, llm_generated_files);

            this.send_sse(res, STAGE.END, { data: final_code });
            objectStore.uploadContractFiles(contract_id, final_code, full_response);
        } catch (error) {
            console.error('Error while new contract generation: ', Error);
            parser.reset();
            this.delete_parser(contract_id);
            res.end();
        }
    }

    protected async old_contract(
        planner_chain: planner,
        coder_chain: coder,
        user_instruction: string,
        contract_id: string,
        idl: Object[],
    ) {
        const data = await planner_chain.invoke({
            user_instruction,
        });

        const coder = await coder_chain.invoke({
            plan: data.plan,
            files_likely_affected: data.files_likely_affected,
        });
    }

    protected get_chains(chat: 'new' | 'old', model: MODEL) {
        let planner_chain;
        let coder_chain;

        const coder = model === MODEL.CLAUDE ? this.claude_coder : this.gemini_coder;

        switch (chat) {
            case 'new': {
                planner_chain = RunnableSequence.from([
                    new_chat_planner_prompt,
                    this.gemini_planner.withStructuredOutput(new_planner_output_schema),
                ]);

                coder_chain = new_chat_coder_prompt.pipe(coder);

                return {
                    planner_chain: planner_chain,
                    coder_chain: coder_chain,
                };
            }

            case 'old': {
                planner_chain = RunnableSequence.from([
                    old_chat_planner_prompt,
                    this.gemini_planner.withStructuredOutput(old_planner_output_schema),
                ]);

                coder_chain = old_chat_coder_prompt.pipe(coder.bindTools([Tool.get_file]));

                return {
                    planner_chain: planner_chain,
                    coder_chain: coder_chain,
                };
            }
        }
    }

    private get_parser(contractId: string, res: Response): StreamParser {
        if (!this.parsers.has(contractId)) {
            const parser = new StreamParser();

            parser.on(PHASE_TYPES.THINKING, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.THINKING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.GENERATING, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.GENERATING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.BUILDING, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.BUILDING, data, systemMessage),
            );

            parser.on(PHASE_TYPES.CREATING_FILES, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.CREATING_FILES, data, systemMessage),
            );

            parser.on(PHASE_TYPES.COMPLETE, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.COMPLETE, data, systemMessage),
            );

            parser.on(FILE_STRUCTURE_TYPES.EDITING_FILE, ({ data, systemMessage }) =>
                this.send_sse(res, FILE_STRUCTURE_TYPES.EDITING_FILE, data, systemMessage),
            );

            parser.on(PHASE_TYPES.ERROR, ({ data, systemMessage }) =>
                this.send_sse(res, PHASE_TYPES.ERROR, data, systemMessage),
            );

            parser.on(STAGE.CONTEXT, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.CONTEXT, data, systemMessage),
            );

            parser.on(STAGE.PLANNING, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.PLANNING, data, systemMessage),
            );

            parser.on(STAGE.GENERATING_CODE, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.GENERATING_CODE, data, systemMessage),
            );

            parser.on(STAGE.BUILDING, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.BUILDING, data, systemMessage),
            );

            parser.on(STAGE.CREATING_FILES, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.CREATING_FILES, data, systemMessage),
            );

            parser.on(STAGE.FINALIZING, ({ data, systemMessage }) =>
                this.send_sse(res, STAGE.FINALIZING, data, systemMessage),
            );

            this.parsers.set(contractId, parser);
        }
        return this.parsers.get(contractId) as StreamParser;
    }

    private delete_parser(contractId: string): void {
        this.parsers.delete(contractId);
    }

    private send_sse(
        res: Response,
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        data: StreamEventData,
        systemMessage?: Message,
    ): void {
        const event: StreamEvent = {
            type,
            data,
            systemMessage: systemMessage as Message,
            timestamp: Date.now(),
        };

        res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    protected create_stream(res: Response): void {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Accel-Buffering', 'no');
        res.flushHeaders();
    }
}
