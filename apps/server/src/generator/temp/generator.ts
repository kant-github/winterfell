import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { MODEL } from '../types/model_types';
import { RunnableSequence } from '@langchain/core/runnables';
import { new_planner_output_schema, old_planner_output_schema } from './schema';
import Tool from '../tools/tool';
import { AIMessageChunk, MessageStructure } from '@langchain/core/messages';
import StreamParser from '../../services/stream_parser';
import { ChatRole, Message, prisma } from '@winterfell/database';
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
import { FileContent } from '@winterfell/types';
import { mergeWithLLMFiles, prepareBaseTemplate } from '../../class/test';
import chalk from 'chalk';
import { finalizer_output_schema } from '../schema/finalizer_output_schema';
import { new_chat_coder_prompt, new_chat_planner_prompt } from '../prompts/new_chat_prompts';
import { finalizer_prompt } from '../prompts/finalizer_prompt';
import { old_chat_coder_prompt, old_chat_planner_prompt } from '../prompts/old_chat_prompts';

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
    protected gemini_finalizer: ChatGoogleGenerativeAI;

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
        this.gemini_finalizer = new ChatGoogleGenerativeAI({
            model: 'gemini-2.5-flash',
            temperature: 0.2,
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
            const { planner_chain, coder_chain, finalizer_chain } = this.get_chains(chat, model);

            switch (chat) {
                case 'new': {
                    this.new_contract(
                        res,
                        planner_chain,
                        coder_chain,
                        finalizer_chain,
                        user_instruction,
                        contract_id,
                        parser,
                    );
                    return;
                }
                case 'old': {
                }
            }
        } catch (error) {
            console.error('Error while generating: ', error);
            parser.reset();
            this.delete_parser(contract_id);
            res.end();
        }
    }

    protected async new_contract(
        res: Response,
        planner_chain: planner,
        coder_chain: any,
        finalizer_chain: any,
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

            // console.log(planner_data);

            const llm_message = await prisma.message.create({
                data: {
                    content: planner_data.context,
                    contractId: contract_id,
                    role: ChatRole.AI,
                },
            });

            console.log('the context: ', chalk.red(planner_data.context));
            this.send_sse(res, STAGE.CONTEXT, {
                context: planner_data.context,
                llmMessage: llm_message,
            });

            if (!planner_data.should_continue) {
                console.log('planner said to not continue.');
                return;
            }

            const { system_message, contract } = await prisma.$transaction(async (tx) => {
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
            console.log('the stage: ', chalk.green('Planning'));
            this.send_sse(res, STAGE.PLANNING, { stage: 'Planning' }, system_message);

            const code_stream = await coder_chain.stream({
                plan: planner_data.plan,
                files_likely_affected: planner_data.files_likely_affected,
            });

            for await (const chunk of code_stream) {
                if (chunk.text) {
                    // console.log(chunk.text);
                    parser.feed(chunk.text, system_message);
                    full_response += chunk.text;
                }
            }

            await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    creatingFiles: true,
                },
            });

            console.log('the stage: ', chalk.green('Creating Files'));
            this.send_sse(res, STAGE.CREATING_FILES, { stage: 'Creating Files' }, system_message);

            const llm_generated_files: FileContent[] = parser.getGeneratedFiles();
            const base_files: FileContent[] = prepareBaseTemplate(planner_data.contract_name!);
            const final_code: FileContent[] = mergeWithLLMFiles(base_files, llm_generated_files);

            this.new_finalizer(
                res,
                finalizer_chain,
                final_code,
                full_response,
                contract_id,
                parser,
                system_message,
            );
        } catch (error) {
            console.error('Error while new contract generation: ', Error);
            parser.reset();
            this.delete_parser(contract_id);
            res.end();
        }
    }

    protected async new_finalizer(
        res: Response,
        finalizer_chain: any,
        generated_files: FileContent[],
        full_response: string,
        contract_id: string,
        parser: StreamParser,
        system_message: Message,
    ) {
        try {
            await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    finalzing: true,
                },
            });

            console.log('the stage: ', chalk.green('Finalizing'));
            this.send_sse(res, STAGE.FINALIZING, { stage: 'Finalizing' }, system_message);

            const finalizer_data = await finalizer_chain.invoke({
                generated_files: generated_files,
            });

            console.log(finalizer_data.idl);

            await prisma.message.update({
                where: {
                    id: system_message.id,
                    contractId: contract_id,
                },
                data: {
                    End: true,
                },
            });
            console.log('the stage: ', chalk.green('END'));
            this.send_sse(res, STAGE.END, { data: generated_files }, system_message);

            console.log('the context: ', chalk.red(finalizer_data.context));
            this.send_sse(res, STAGE.CONTEXT, { data: finalizer_data.context }, system_message);

            objectStore.uploadContractFiles(contract_id, generated_files, full_response);

            // save the idl to data base
            await prisma.contract.update({
                where: {
                    id: contract_id,
                },
                data: {
                    summarisedObject: finalizer_chain.idl,
                },
            });

            // make a protected var to store idl in stream parser
            // save the idl to db
        } catch (error) {
            console.error('Error while finalizing: ', error);
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

        const planner_data = await planner_chain.invoke({
            user_instruction: user_instruction,
            idl: idl,
        });

        console.log(planner_data);


    }

    protected get_chains(
        chat: 'new' | 'old',
        model: MODEL,
    ): { planner_chain: any; coder_chain: any; finalizer_chain: any } {
        let planner_chain;
        let coder_chain;
        let finalizer_chain;

        const coder = model === MODEL.CLAUDE ? this.claude_coder : this.gemini_coder;

        switch (chat) {
            case 'new': {
                planner_chain = RunnableSequence.from([
                    new_chat_planner_prompt,
                    this.gemini_planner.withStructuredOutput(new_planner_output_schema),
                ]);

                coder_chain = new_chat_coder_prompt.pipe(coder);

                finalizer_chain = RunnableSequence.from([
                    finalizer_prompt,
                    this.gemini_finalizer.withStructuredOutput(finalizer_output_schema),
                ]);

                return {
                    planner_chain: planner_chain,
                    coder_chain: coder_chain,
                    finalizer_chain: finalizer_chain,
                };
            }

            case 'old': {
                planner_chain = RunnableSequence.from([
                    old_chat_planner_prompt,
                    this.gemini_planner.withStructuredOutput(old_planner_output_schema),
                ]);

                coder_chain = old_chat_coder_prompt.pipe(coder.bindTools([Tool.get_file]));

                finalizer_chain = RunnableSequence.from([
                    finalizer_prompt,
                    this.gemini_finalizer.withStructuredOutput(finalizer_output_schema),
                ]);

                return {
                    planner_chain: planner_chain,
                    coder_chain: coder_chain,
                    finalizer_chain,
                };
            }
        }
    }

    protected get_parser(contract_id: string, res: Response): StreamParser {
        if (!this.parsers.has(contract_id)) {
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

            this.parsers.set(contract_id, parser);
        }
        return this.parsers.get(contract_id) as StreamParser;
    }

    protected delete_parser(contract_id: string): void {
        this.parsers.delete(contract_id);
    }

    protected send_sse(
        res: Response,
        type: PHASE_TYPES | FILE_STRUCTURE_TYPES | STAGE,
        data: StreamEventData,
        system_message?: Message,
    ): void {
        const event: StreamEvent = {
            type,
            data,
            systemMessage: system_message as Message,
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
