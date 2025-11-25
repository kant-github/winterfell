import { PromptTemplate } from '@langchain/core/prompts';

export const new_chat_planner_prompt = new PromptTemplate({
    template: `
        You're a senior anchor solana contract planning agent

        generate a contract based on the user instruction:
        {user_instruction}

        give the contract a name, a context, and a stage:
        <name>contract_name</name>
        <context>context about what will you do in near about 20 words</context>
        <stage>Planning</stage>

        You should follow this file structure:
        /migrations
            └── deploy.ts
        /programs
            └── [program_name]
                └── src
                    ├── lib.rs
                    ├── constants.rs (if needed)
                    ├── errors
                        ├── mod.rs
                        └── error_codes.rs
                    ├── state
                        ├── mod.rs
                        └── [state_name].rs
                    ├── instructions
                        ├── mod.rs
                        └── [instruction_name].rs
                    └── utils (if needed)
                        ├── mod.rs
                        └──[utility_name].rs
        /tests
            └── [program_name].ts
        .gitignore
        .prettierignore
        Anchor.toml
        Cargo.toml
        package.json
        tsconfig.json

        make a plan and return affected files list.
        if the user's instruction is not related to anchor solana contract then you should return the should_continue as false, to avoid the coder to not code.

    `,
    inputVariables: ['user_instruction'],
});

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

export const new_chat_coder_prompt = new PromptTemplate({
    template: `
        You're a senior anchor solana contract developer

        follow this plan:
        {plan}

        and generate these files based on the plan
        {files_likely_affected}

        and strictly follow this architecture of generation with the following order
        you should not miss any stage or phase

        <stage>Generating Code</state>

        <phase>thinking</phase>
        <phase>generating</phase>

        <file>path_to_the_file</file>

        <phase>deleting</phase> (if needed)
        <file>path_to_the_file</file>

        <phase>updating</phase>
        <file>path_to_the_file</file>

        <stage>Building</stage>
        <stage>Creating Files</stage>
        <stage>Finalizing</stage>

        <context>context at the end of contract of what have you done in near about 20 words</context>

    `,
    inputVariables: ['plan', 'files_likely_affected'],
});

export const old_chat_coder_prompt = new PromptTemplate({
    template: ``,
    inputVariables: ['plan', 'contract_id', 'files_likely_affected'],
});
