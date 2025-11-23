import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import env from '../../configs/config.env';
import { MessagesAnnotation, StateGraph, Annotation } from '@langchain/langgraph';
import Tool from './tool';
import { AIMessage, BaseMessage } from '@langchain/core/messages';
import StreamParser from '../../services/stream_parser';
import { ChatRole, prisma } from '@repo/database';

// Create custom state annotation that extends MessagesAnnotation
const AgentState = Annotation.Root({
    ...MessagesAnnotation.spec,
    contractId: Annotation<string>({
        reducer: (current, update) => update ?? current,
        default: () => '',
    }),
});

export default class Agent {
    private llm;
    private agent_builder;
    private parser: StreamParser;
    private totalInputTokens: number = 0;
    private totalOutputTokens: number = 0;

    constructor() {
        this.llm = new ChatGoogleGenerativeAI({
            model: 'gemini-2.0-flash',
            temperature: 0.2,
            apiKey: env.SERVER_GEMINI_API_KEY,
            streaming: true,
        }).bindTools([Tool.get_rule]);

        // Use custom AgentState instead of MessagesAnnotation
        this.agent_builder = new StateGraph(AgentState)
            .addNode('llmCall', this.llm_call.bind(this))
            .addNode('toolNode', Tool.node)
            .addEdge('__start__', 'llmCall')
            .addConditionalEdges('llmCall', this.should_continue.bind(this), [
                'toolNode',
                '__end__',
            ])
            .addEdge('toolNode', 'llmCall')
            .compile();

        this.parser = new StreamParser();
    }

    /**
     * Main entry point for generating contracts
     */
    public async final_call(
        contractId: string = '66e3dab4-cc7f-49de-9b64-c5b0c007ad58',
        userPrompt: string = 'create a counter contract with only increment.'
    ) {
        try {
            console.log('Starting AI call and response...');
            
            const result = await this.agent_builder.invoke({
                messages: [
                    {
                        role: 'user',
                        content: userPrompt,
                    },
                ],
                contractId: contractId, // Now this works!
            });

            // Get the final AI message
            const lastMessage = result.messages[result.messages.length - 1];

            console.log('tokens -------------------------->')
            console.log(`Input tokens:  ${this.totalInputTokens}`);
            console.log(`Output tokens: ${this.totalOutputTokens}`);
            console.log(`Total tokens:  ${this.totalInputTokens + this.totalOutputTokens}`);

            console.log('printing generated files----------->');
            this.parser.getGeneratedFiles();

            if (lastMessage && 'content' in lastMessage) {
                console.log('\n=== GENERATION COMPLETE ===\n');
                return {
                    success: true,
                    content: lastMessage.content,
                    messages: result.messages,
                    contractId: result.contractId,
                };
            }

            return {
                success: false,
                error: 'No content generated',
                messages: result.messages,
                contractId: result.contractId,
            };
        } catch (error) {
            console.error('Error in final_call:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                messages: [],
                contractId: contractId,
            };
        }
    }

    private async llm_call(state: typeof AgentState.State) {
        let final_content: string = '';
        let tool_calls: any[] = [];
        let systemMessage;

        try {
            // Create system message in DB if contractId is provided
            if (state.contractId) {
                systemMessage = await prisma.message.create({
                    data: {
                        contractId: state.contractId,
                        role: ChatRole.SYSTEM,
                        content: 'Starting generation...',
                    },
                });
            }

            const stream = await this.llm.stream([
                {
                    role: 'system',
                    content: this.coder_content,
                },
                ...state.messages,
            ]);

            for await (const chunk of stream) {
                if (!chunk) {
                    console.warn('Received empty chunk');
                    continue;
                }

                // console.log(chunk.text);

                if(chunk.usage_metadata) {
                    if(chunk.usage_metadata.input_tokens > 0) this.totalInputTokens = chunk.usage_metadata.input_tokens;
                    if(chunk.usage_metadata.output_tokens > 0) this.totalOutputTokens = chunk.usage_metadata.output_tokens; 
                }

                // Handle text content
                if (chunk.text) {
                    if (systemMessage) {
                        this.parser.feed(chunk.text, systemMessage);
                    }
                    final_content += chunk.content;
                } else if (chunk.content && chunk.content === 'string') {
                    if (systemMessage) {
                        this.parser.feed(chunk.content, systemMessage);
                    }
                    final_content += chunk.text;
                }

                // Handle tool calls
                if (chunk.tool_calls && Array.isArray(chunk.tool_calls)) {
                    tool_calls = chunk.tool_calls;
                }

                if (chunk.additional_kwargs?.tool_calls) {
                    tool_calls = chunk.additional_kwargs.tool_calls;
                }
            }

            // Update system message with final content
            if (systemMessage && final_content) {
                await prisma.message.update({
                    where: { id: systemMessage.id },
                    data: { content: final_content },
                });
            }

            const message = new AIMessage({
                content: final_content || 'No content generated',
                tool_calls: tool_calls.length > 0 ? tool_calls : undefined,
            });

            return {
                messages: [message],
                contractId: state.contractId, // Pass through contractId
            };
        } catch (error) {
            console.error('Error in llm_call:', error);

            const errorMessage = new AIMessage({
                content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
                tool_calls: undefined,
            });

            return {
                messages: [errorMessage],
                contractId: state.contractId,
            };
        }
    }

    private has_tool_calls(msg: any): msg is { tool_calls: any[] } {
        return (
            msg !== null &&
            msg !== undefined &&
            Array.isArray(msg?.tool_calls) &&
            msg.tool_calls.length > 0
        );
    }

    private should_continue(state: typeof AgentState.State) {
        const last_message = state.messages.at(-1);

        if (!last_message) {
            return '__end__';
        }

        // Check for tool calls
        if (this.has_tool_calls(last_message)) {
            return 'toolNode';
        }

        // Check for END marker
        if (
            typeof last_message?.content === 'string' &&
            last_message.content.includes('<END>')
        ) {
            return '__end__';
        }

        return '__end__';
    }

    private coder_content = `
You are a senior Anchor Solana smart contract developer.

IF YOU need rules, CALL get_rule({ rule_name }) **using ONLY EXACT NAMES from above**.
NEVER invent your own rule names.

TOOLS:
- You can call "get_rule" anytime you need coding guidelines.
- The argument is: { rule_name: string }

RULE:
If user asks for a contract, and you need any rule, ALWAYS call the tool.
Do not guess rules.

AVAILABLE RULES:
At first, do fetch staging_schema and anchor_file_structure for understanding the staging structure.
${Tool.get_rules_name()}

Process:
1. Think if rules are needed. If yes → call the tool.
2. Wait for tool output.
3. Continue generating the contract with correct rules.

IMPORTANT: After generating all code files, you MUST call get_rule({ rule_name: "output_format_protocol" })
to understand how to format your final output for proper database storage.
`;
}
