import { MODEL, STAGE } from '@winterfell/types';
import { Response } from 'express';
import StreamParser from '../../services/stream_parser';
import { old_finalizer, old_planner } from '../types/generator_types';
import { ChatRole, prisma } from '@winterfell/database';
import chalk from 'chalk';
import Generator from '../generator';
import ResponseWriter from '../../class/response_writer';
import { old_chat_coder_prompt } from '../prompts/old_chat_prompts';
import Tool from '../tools/tool';

export default class Template extends Generator {
    protected async generate_new_contract(
        res: Response,
        user_instruction: string,
        planner_chain: old_planner,
        finalizer_chain: old_finalizer,
        contract_id: string,
        idl: Object[],
        parser: StreamParser,
    ) {
        const planner_data = await planner_chain.invoke({
            user_instruction: user_instruction,
            idl: idl,
        });

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
            parser.reset();
            this.delete_parser(contract_id);
            ResponseWriter.stream.end(res);
            return;
        }

        let system_message = await prisma.message.create({
            data: {
                contractId: contract_id,
                role: ChatRole.SYSTEM,
                content: 'starting to generate in a few seconds',
                stage: STAGE.PLANNING,
            },
        });

        // send planning stage from here
        console.log('the stage: ', chalk.green('Planning'));
        this.send_sse(res, STAGE.PLANNING, { stage: 'Planning' }, system_message);

        const promptValue = await old_chat_coder_prompt.invoke({
            plan: planner_data.plan,
            contract_id,
            files_likely_affected: planner_data.files_likely_affected,
        });

        const initialMessages = promptValue.toChatMessages();

        const toolStepResult = await this.gemini_coder
            .bindTools([Tool.get_template_file])
            .invoke(initialMessages);

        const { toolResults } = await Tool.runner.invoke(toolStepResult);
        const { messages: toolMessages } = await Tool.convert.invoke({ toolResults });

        const code_stream = await this.gemini_coder.stream([
            ...initialMessages,
            toolStepResult,
            ...toolMessages,
            {
                role: 'user',
                content: 'Use the fetched file contents to implement the planned changes.',
            },
        ]);

        for await (const chunk of code_stream) {
            if (chunk && chunk.text) {
                parser.feed(chunk.text, system_message);
            }
        }

        system_message = await prisma.message.update({
            where: {
                id: system_message.id,
                contractId: contract_id,
            },
            data: {
                stage: STAGE.BUILDING,
            },
        });

        console.log('the stage: ', chalk.green('Building'));
        this.send_sse(res, STAGE.BUILDING, { stage: 'Building' }, system_message);

        const gen_files = parser.getGeneratedFiles();
        // await this.update_contract_2(contract_id, gen_files, delete_files);

        system_message = await prisma.message.update({
            where: {
                id: system_message.id,
                contractId: contract_id,
            },
            data: {
                stage: STAGE.CREATING_FILES,
            },
        });

        console.log('the stage: ', chalk.green('Creating Files'));
        this.send_sse(res, STAGE.CREATING_FILES, { stage: 'Creating Files' }, system_message);

        // this.old_finalizer(
        //     res,
        //     finalizer_chain,
        //     gen_files,
        //     contract_id,
        //     parser,
        //     system_message,
        // );
    }
}
