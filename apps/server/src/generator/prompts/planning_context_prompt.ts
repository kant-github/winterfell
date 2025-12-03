import { PromptTemplate } from '@langchain/core/prompts';

export const planning_context_prompt = new PromptTemplate({
    template: `
You're an expert Anchor Solana contract planning agent.

Your job: create a clear contract plan before agent begins.

Provide:
- contract_title
- short_description (≈20 words)
- long_description (≈60 words)
- contract_instructions: a list of instructions the contract should include. Each instruction must have:
    - title (max two words)
    - short_description
    - long_description explaining what the instruction does and how it works

Generate only structured planning information based on the user instructions, {user_instruction} No code, no extra text.
    `,
    inputVariables: ['user_instruction'],
});
