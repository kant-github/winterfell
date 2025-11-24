import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MODEL } from "../types/model_types";
import { RunnableSequence } from "@langchain/core/runnables";
import { new_planner_output_schema, old_planner_output_schema } from "./schema";
import Tool from "../tools/tool";
import { new_chat_coder_prompt, new_chat_planner_prompt, old_chat_coder_prompt, old_chat_planner_prompt } from "./prompts";
import { AIMessageChunk, MessageStructure } from "@langchain/core/messages";
import StreamParser from "../../services/stream_parser";

type planner = RunnableSequence<{
    user_instruction: string;
    idl?: Object[];
}, {
    should_continue: boolean;
    plan: string;
    files_likely_affected: {
        do: "create" | "update" | "delete";
        file_path: string;
        what_to_do: string;
    }[];
}>;

type coder = RunnableSequence<{
    plan: any;
    files_likely_affected: any;
}, AIMessageChunk<MessageStructure>>

export default class Generator {

    private gemini_planner: ChatGoogleGenerativeAI;
    private gemini_coder: ChatGoogleGenerativeAI;
    private claude_coder: ChatAnthropic;

    constructor() {
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
    }

    public generate(
        chat: 'new' | 'old',
        user_instruction: string,
        model: MODEL,
        contract_id?: string,
        idl?: Object[],
    ) {

        console.log('gen.generator is called');
        const { planner_chain, coder_chain } = this.get_chains(chat, model);
        this.new_contract(
            planner_chain,
            coder_chain,
            user_instruction,
        );
    }

    private async new_contract(
        planner_chain: planner,
        coder_chain: coder,
        user_instruction: string,
    ) {

        const parser = new StreamParser();

        const data = await planner_chain.invoke({
            user_instruction,
        });

        console.log(data);

        if(!data.should_continue) {
            console.log('planner said to not continue.');
            return;
        }

        // send planning stage from here

        const code_stream = await coder_chain.stream({
            plan: data.plan,
            files_likely_affected: data.files_likely_affected,
        });

        for(const chunk of code_stream) {

        }

    }

    private async old_contract(
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

    private get_chains(chat: 'new' | 'old', model: MODEL) {

        let planner_chain;
        let coder_chain;

        const coder = model === MODEL.CLAUDE ? this.claude_coder : this.gemini_coder;

        switch (chat) {
            case 'new': {
                planner_chain = RunnableSequence.from([
                    new_chat_planner_prompt,
                    this.gemini_planner.withStructuredOutput(new_planner_output_schema),
                ]);

                coder_chain = RunnableSequence.from([
                    new_chat_coder_prompt,
                    coder,
                ]);

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

                coder_chain = RunnableSequence.from([
                    old_chat_coder_prompt,
                    coder.bindTools([Tool.get_file]),
                ]);

                return {
                    planner_chain: planner_chain,
                    coder_chain: coder_chain,
                };
            }
        }
    }

    private create_chain() {

    }
}