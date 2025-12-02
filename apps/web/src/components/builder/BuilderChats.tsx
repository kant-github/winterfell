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
import { useChatStore } from '@/src/store/user/useChatStore';
import { ChatRole, Message } from '@/src/types/prisma-types';
import { LayoutGrid } from '../ui/animated/layout-grid-icon';
import { TextShimmer } from '../ui/shimmer-text';
import { formatChatTime } from '@/src/lib/format_chat_time';
import { toast } from 'sonner';
import { useActiveTemplateStore } from '@/src/store/user/useActiveTemplateStore';
import PlanExecutorPanel from '../code/PlanExecutorPanel';
import GenerateContract from '@/src/lib/server/generate_contract';

export default function BuilderChats() {
    const { session } = useUserSessionStore();
    const params = useParams();
    const contractId = params.contractId as string;
    const hasInitialized = useRef<boolean>(false);
    const messageEndRef = useRef<HTMLDivElement>(null);
    const { setContractId } = useChatStore();
    const { messages, loading } =
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
        await GenerateContract.start_new_chat(
            session?.user.token || '',
            contractId,
            message,
            setHasContext,
            (error) => {
                toast.error(error.message);
                router.push('/');
            }
        );
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
                <PlanExecutorPanel expanded={false} hidePlanSvg={true} className="border border-neutral-800 rounded-[8px] bg-[#1b1d20]" />
                <div ref={messageEndRef} />
            </div>
            <div className="flex items-center justify-center w-full py-4 px-6 flex-shrink-0">
                <BuilderChatInput />
            </div>
        </div>
    );
}
