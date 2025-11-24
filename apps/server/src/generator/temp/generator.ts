import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MODEL } from "../types/model_types";
import { RunnableSequence } from "@langchain/core/runnables";
import { planner_output_schema } from "./schema";
import Tool from "../tools/tool";
import { new_chat_coder_prompt, new_chat_planner_prompt, old_chat_coder_prompt } from "./prompts";
import { PromptTemplate } from "@langchain/core/prompts";


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
            temperature: 0.2,
        });
        this.claude_coder = new ChatAnthropic({
            model: 'claude-sonnet-4-5-20250929',
        });
    }

    public generate(
        chat: 'new' | 'old',
        contract_id: string,
        user_instruction: string,
        model: MODEL,
        idl?: Object[],
    ) {
        switch(chat) {
            case 'new':
                this.generate_contract(
                    model,
                    new_chat_planner_prompt,
                    new_chat_coder_prompt,
                    contract_id,
                    user_instruction,
                    idl,
                );
                return;

            case 'old':
                return;

            default:
                console.error('unwanted chat status');
                return;
        }
    }

    private generate_contract(
        model: MODEL,
        planner_prompt: PromptTemplate,
        coder_prompt: PromptTemplate,
        contract_id: string,
        user_instruction: string,
        idl?: Object[],
    ) {

        const planner_chain = RunnableSequence.from([
            planner_prompt,
            this.gemini_planner.withStructuredOutput(planner_output_schema),
        ]);

        const coder = model === MODEL.CLAUDE ? this.claude_coder : this.gemini_coder;

        const coder_chain = RunnableSequence.from([
            coder_prompt,
            coder.bindTools([Tool.get_file]),
            coder
        ]);



    }

    private create_chain() {

    }
}