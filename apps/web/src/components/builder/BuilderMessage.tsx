import { Message } from '@/src/types/prisma-types';
import { JSX, useState } from 'react';
import { LayoutGrid } from '../ui/animated/layout-grid-icon';
import AppLogo from '../tickers/AppLogo';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import Image from 'next/image';
import { TextShimmer } from '../ui/shimmer-text';
import { formatChatTime } from '@/src/lib/format_chat_time';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import PlanExecutorPanel from '../code/PlanExecutorPanel';
import { useSidePanelStore } from '@/src/store/code/useSidePanelStore';
import { useCodeEditor } from '@/src/store/code/useCodeEditor';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { SidePanelValues } from '../code/EditorSidePanel';
import { useEditPlanStore } from '@/src/store/code/useEditPlanStore';
import SystemMessage from './SystemMessage';

interface BuilderMessageProps {
    message: Message;
    loading: boolean;
    returnParsedData: (message: string) => string;
}

export default function BuilderMessage({
    message,
    loading,
    returnParsedData,
}: BuilderMessageProps): JSX.Element {
    const { session } = useUserSessionStore();
    const { messages } = useBuilderChatStore();
    const [collapsePanel, setCollapsePanel] = useState<boolean>(false);
    const { editExeutorPlanPanel, setEditExeutorPlanPanel } = useExecutorStore();
    const { setCollapseFileTree } = useCodeEditor();
    const { setCurrentState } = useSidePanelStore();
    const { setMessage } = useEditPlanStore();

    return (
        <div className="w-full shrink-0">
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

            {message.role === 'TEMPLATE' && (
                <div className="flex justify-end items-start w-full">
                    <div className="flex items-start gap-x-2 max-w-[70%]">
                        <div className="flex flex-col gap-y-2">
                            <div>
                                <span className="text-right flex justify-end text-xs font-semibold mb-1 mr-1">
                                    {formatChatTime(message.createdAt)}
                                </span>
                            </div>
                            <div className="relative w-full h-34 aspect-[4/3] rounded-b-[8px] rounded-tl-[8px] overflow-hidden flex items-center justify-end">
                                <Image
                                    src={'/templates/contract-2.jpg'}
                                    alt="Contract preview"
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
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

            {message.role === 'PLAN' && message.plannerContext && (
                <PlanExecutorPanel
                    plan={JSON.parse(String(message.plannerContext))}
                    editExeutorPlanPanel={editExeutorPlanPanel}
                    onCollapse={() => {
                        setCollapsePanel((prev) => !prev);
                    }}
                    onEdit={() => {
                        setMessage(JSON.parse(String(message.plannerContext)));
                        setEditExeutorPlanPanel(true);
                        setCurrentState(SidePanelValues.PLAN);
                        setCollapseFileTree(false);
                        setCollapsePanel(true);
                    }}
                    onExpand={() => {
                        setMessage(JSON.parse(String(message.plannerContext)));
                        setCollapseFileTree(false);
                        setCurrentState(SidePanelValues.PLAN);
                        setCollapsePanel(true);
                    }}
                    collapse={collapsePanel}
                    expanded={false}
                    hidePlanSvg={true}
                    className="border border-neutral-800 rounded-[8px] bg-[#1b1d20]"
                />
            )}

            {/* for rendering ai loader */}
            {message.role === 'USER' &&
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
                                    <LayoutGrid shouldAnimate={loading} className="h-4 w-4" />
                                    <TextShimmer>Processing your request...</TextShimmer>
                                </div>
                            )}
                            <SystemMessage message={message} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
