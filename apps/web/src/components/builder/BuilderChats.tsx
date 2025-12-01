'use client';
import BuilderChatInput from './BuilderChatInput';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import Image from 'next/image';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { GENERATE_CONTRACT, GENERATE_TEMPLATE } from '@/routes/api_routes';
import {
    FILE_STRUCTURE_TYPES,
    FileContent,
    MODEL,
    PHASE_TYPES,
    STAGE,
    StreamEvent,
} from '@/src/types/stream_event_types';
import SystemMessage from './SystemMessage';
import AppLogo from '../tickers/AppLogo';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useChatStore } from '@/src/store/user/useChatStore';
import { ChatRole, Message } from '@/src/types/prisma-types';
import { LayoutGrid } from '../ui/animated/layout-grid-icon';
import { TextShimmer } from '../ui/shimmer-text';
import { formatChatTime } from '@/src/lib/format_chat_time';
import { toast } from 'sonner';
import { useActiveTemplateStore } from '@/src/store/user/useActiveTemplateStore';
import PlanExecutorPanel from '../code/PlanExecutorPanel';

export default function BuilderChats() {
    const { session } = useUserSessionStore();
    const params = useParams();
    const contractId = params.contractId as string;
    const hasInitialized = useRef<boolean>(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { setCollapseFileTree } = useCodeEditor();
    const { setContractId } = useChatStore();
    const { parseFileStructure, deleteFile } = useCodeEditor();
    const { messages, loading, setLoading, upsertMessage, setPhase, setCurrentFileEditing } =
        useBuilderChatStore();
    const router = useRouter();
    const [hasContext, setHasContext] = useState<boolean>(false);
    const { activeTemplate, resetTemplate } = useActiveTemplateStore();

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (hasInitialized.current) return;
        if (
            activeTemplate &&
            activeTemplate.id &&
            messages.length === 1 &&
            messages[0].role === ChatRole.USER &&
            messages[0].contractId === contractId
        ) {
            getTemplates(messages[0].content);
        } else if (
            messages.length === 1 &&
            messages[0].role === 'USER' &&
            messages[0].contractId === contractId
        ) {
            hasInitialized.current = true;
            startChat(messages[0].content);
            setContractId(contractId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [contractId, messages.length]);

    async function getTemplates(message: string) {
        try {
            setLoading(true);
            const response = await fetch(GENERATE_TEMPLATE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({
                    contract_id: contractId,
                    template_id: activeTemplate?.id,
                    template_title: activeTemplate?.title,
                    instruction: message,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate template');
            }
            const json = await response.json();

            const files = json.data;
            if (!Array.isArray(files)) {
                throw new Error('Invalid template data');
            }

            parseFileStructure(files);
            setCollapseFileTree(true);
            resetTemplate();
        } catch (error) {
            console.error('Chat stream error:', error);
        } finally {
            setLoading(false);
        }
    }

    async function startChat(message: string) {
        try {
            setLoading(true);
            const response = await fetch(GENERATE_CONTRACT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.user.token}`,
                },
                body: JSON.stringify({
                    contract_id: contractId,
                    instruction: message,
                    model: MODEL.GEMINI,
                }),
            });

            if (response.status === 423) {
                const data = await response.json();
                if (data.goBack) {
                    toast.error(data.message);
                    router.push('/');
                }
            }

            if (!response.ok) {
                throw new Error('Failed to start chat');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() ?? '';

                for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed) continue;

                    try {
                        const jsonString = trimmed.startsWith('data: ')
                            ? trimmed.slice(6)
                            : trimmed;
                        const event: StreamEvent = JSON.parse(jsonString);

                        switch (event.type) {
                            case PHASE_TYPES.STARTING:
                                if (event.systemMessage) {
                                    upsertMessage(event.systemMessage);
                                }
                                break;

                            case STAGE.CONTEXT:
                                if ('llmMessage' in event.data) {
                                    setHasContext(true);
                                    upsertMessage(event.data.llmMessage as Message);
                                }
                                break;

                            case STAGE.PLANNING:
                            case STAGE.GENERATING_CODE:
                            case STAGE.BUILDING:
                            case STAGE.CREATING_FILES:
                            case STAGE.FINALIZING:
                                if (event.systemMessage) {
                                    upsertMessage(event.systemMessage);
                                }
                                break;

                            case PHASE_TYPES.THINKING:
                            case PHASE_TYPES.GENERATING:
                            case PHASE_TYPES.BUILDING:
                            case PHASE_TYPES.CREATING_FILES:
                            case PHASE_TYPES.COMPLETE:
                            case PHASE_TYPES.DELETING:
                                setPhase(event.type);
                                break;

                            case FILE_STRUCTURE_TYPES.EDITING_FILE:
                                setPhase(event.type);
                                if ('file' in event.data) {
                                    if ('phase' in event.data && event.data.phase === 'deleting') {
                                        deleteFile(event.data.file as string);
                                    } else {
                                        setCurrentFileEditing(event.data.file as string);
                                    }
                                }
                                break;

                            case PHASE_TYPES.ERROR:
                                console.error('LLM Error:', event.data);
                                break;

                            case STAGE.END:
                                if ('data' in event.data && event.data.data) {
                                    if (event.systemMessage) {
                                        upsertMessage(event.systemMessage);
                                    }
                                    parseFileStructure(event.data.data as FileContent[]);
                                    setLoading(false);
                                    setCollapseFileTree(true);
                                }
                                break;

                            default:
                                break;
                        }
                    } catch {
                        console.warn('Skipping incomplete stream event chunk');
                    }
                }
            }

            setCollapseFileTree(true);
        } catch (error) {
            console.error('Chat stream error:', error);
        } finally {
            setLoading(false);
        }
    }

    function returnParsedData(message: string) {
        const result = message.split('<stage>')[0];
        return result;
    }

    return (
        <div
            className="w-full max-w-md min-w-md flex flex-col pt-4"
            style={{ height: 'calc(100vh - 3.5rem)' }}
        >
            <div className="flex-1 flex flex-col gap-y-3 text-light text-sm pl-4 overflow-y-auto min-h-0 custom-scrollbar">
                {messages.map((message) => (
                    <div key={message.id} className="w-full shrink-0">
                        {message.role === 'USER' && (
                            <div className="flex justify-end items-start w-full">
                                <div className="flex items-start gap-x-2 max-w-[70%]">
                                    <div>
                                        <span className="text-right flex justify-end text-xs font-semibold mb-1 mr-1">
                                            {formatChatTime(message.createdAt)}
                                        </span>
                                        <div className="px-4 py-2 rounded-b-[8px] rounded-tl-[8px] text-sm font-semibold bg-primary text-light text-right">
                                            {message.content}
                                        </div>
                                    </div>
                                    {session?.user.image && (
                                        <Image
                                            className="rounded-full shrink-0"
                                            src={session.user.image}
                                            alt="user"
                                            width={32}
                                            height={32}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {/* for rendering ai loader */}
                        {message.role === 'USER' &&
                            !hasContext &&
                            loading &&
                            !messages.some((m) => m.role === 'AI') && (
                                <div className="flex justify-start w-full mt-2 ">
                                    <div className="flex items-start gap-x-2 max-w-[70%]">
                                        <AppLogo showLogoText={false} size={22} />
                                        <div className="px-4 py-2 rounded-[4px] text-sm font-normal bg-dark text-light text-left tracking-wider text-[13px] italic">
                                            <div className="flex items-center gap-x-1">
                                                <div className="flex space-x-1">
                                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        {message.role === 'AI' && (
                            <div className="flex justify-start w-full">
                                <div className="flex items-start gap-x-2 max-w-[70%]">
                                    <AppLogo showLogoText={false} size={22} />
                                    <div className="px-4 py-2 rounded-tr-[8px] rounded-b-[8px] text-sm font-normal bg-[#1b1d20] border border-neutral-800 text-light text-left tracking-wider text-[13px] italic">
                                        {returnParsedData(message.content)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {message.role === 'SYSTEM' && (
                            <div className="flex justify-start items-start w-full my-4 ">
                                <div className="flex items-start gap-x-2 w-full">
                                    <div className="rounded-[4px] text-sm font-normal w-full text-light text-left tracking-wider text-[13px]">
                                        {loading && (
                                            <div className="flex items-center gap-x-1 mb-2">
                                                <LayoutGrid
                                                    shouldAnimate={loading}
                                                    className="h-4 w-4"
                                                />
                                                <TextShimmer>
                                                    Processing your request...
                                                </TextShimmer>
                                            </div>
                                        )}
                                        <SystemMessage
                                            message={message}
                                            data={{
                                                currentStage: undefined as never,
                                                currentPhase: undefined as never,
                                                currentFile: undefined as never,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                <PlanExecutorPanel />
                <div ref={messageEndRef} />
            </div>
            <div className="flex items-center justify-center w-full py-4 px-6 flex-shrink-0">
                <BuilderChatInput />
            </div>
        </div>
    );
}
