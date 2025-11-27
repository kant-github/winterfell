import { PromptTemplate } from "@langchain/core/prompts";


export const old_chat_planner_prompt = new PromptTemplate({
    template: `
        You're a senior anchor solana contract planning agent

        and based on user instruction:
        {user_instruction}

        give the contract a context, and a stage:
        <context>context about what will you do in near about 20 words</context>
        <stage>Planning</stage>

        make a plan on changing the contract based on reading this summary of the contract
        {idl}

        strictly follow the file structure
    `,
    inputVariables: ['idl', 'user_instruction'],
});

export const old_chat_coder_prompt = new PromptTemplate({
    template: ``,
    inputVariables: ['plan', 'contract_id', 'files_likely_affected'],
});