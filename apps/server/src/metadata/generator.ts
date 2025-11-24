import { ChatAnthropic } from "@langchain/anthropic";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MODEL } from "../generator/types/model_types";
import { Runnable, RunnableSequence } from "@langchain/core/runnables";

export default abstract class GeneratorShape {

    protected gemini_planner!: ChatGoogleGenerativeAI;
    protected gemini_coder!: ChatGoogleGenerativeAI;
    protected claude_coder!: ChatAnthropic;

    /**
     * this is a user exposed method which starts the generation process of the content
     * @param {'new' | 'old'} chat 
     * @param {string} user_instruction 
     * @param {MODEL} model 
     * @param {string} contract_id 
     * @param {Object[]} idl 
     */
    abstract generate(
        chat: 'new' | 'old',
        user_instruction: string,
        model: MODEL,
        contract_id: string,
        idl?: Object[],
    ): void;

    /**
     * this method is used to generate a new contract
     * @param {RunnableSequence} planner_chain 
     * @param {Runnable} coder_chain 
     * @param {string} user_instruction 
     * @param {string} contract_id 
     */
    protected abstract new_contract(
        planner_chain: RunnableSequence,
        coder_chain: Runnable,
        user_instruction: string,
        contract_id: string,
    ): void;

    /**
     * this method is used to update an old contract
     * @param {RunnableSequence} planner_chain 
     * @param {Runnable} coder_chain 
     * @param {string} user_instruction 
     * @param {string} contract_id 
     * @param {Object[]} idl 
     */
    protected abstract old_contract(
        planner_chain: RunnableSequence,
        coder_chain: Runnable,
        user_instruction: string,
        contract_id: string,
        idl: Object[],
    ): void;

    /**
     * 
     * @param {'new' | 'old'} chat 
     * @param {MODEL} model 
     * @returns {{ planner_chain: RunnableSequence, coder_chain: Runnable}} returns a object of planner and coder chains
     */
    protected abstract get_chains(
        chat: 'new' | 'old',
        model: MODEL,
    ): { planner_chain: any; coder_chain: any };
}
