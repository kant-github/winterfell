import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ArrowRight, FileCode } from 'lucide-react';
import React, { useState, KeyboardEvent, useRef } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams, useRouter } from 'next/navigation';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import LoginModal from '../utility/LoginModal';
import ExecutorSelect from '../base/ExecutorSelect';
import { ChatRole } from '@/src/types/prisma-types';
import BuilderTemplatesPanel from './BuilderTemplatesPanel';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';
import { RxCross2 } from 'react-icons/rx';
import Image from 'next/image';
import useGenerate from '@/src/hooks/useGenerate';
import { TbExternalLink } from 'react-icons/tb';
import { v4 as uuid } from 'uuid';

export default function BuilderChatInput() {
    const [inputValue, setInputValue] = useState<string>('');
    const { executor, setExecutor } = useExecutorStore();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const { messages } = useBuilderChatStore();
    const templateButtonRef = useRef<HTMLButtonElement | null>(null);
    const templatePanelRef = useRef<HTMLDivElement | null>(null);
    const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);
    const { activeTemplate, resetTemplate } = useTemplateStore();
    const { set_states, handleGeneration } = useGenerate();
    const [hasExistingMessages, setHasExistingMessages] = useState<boolean>(false);
    const params = useParams();
    const router = useRouter();
    const contractId = params.contractId as string;

    async function handleSubmit() {
        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }

        set_states(contractId, inputValue, activeTemplate?.id);
        handleGeneration(contractId, inputValue, activeTemplate?.id);
    }

    const userMessagesLength = messages.filter((m) => m.role === ChatRole.USER).length;

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            if (!hasExistingMessages && activeTemplate) {
                handleSubmit();
            } else if (hasExistingMessages && !activeTemplate) {
                handleSubmit();
            }
        }
    }

    function handleContinueToNewChat() {
        const redirect_contract_id = uuid();
        set_states(contractId, inputValue, activeTemplate?.id);
        router.push(`/playground/${redirect_contract_id}`);
    }

    const isDisabled =
        (!inputValue.trim() && !activeTemplate) || (!activeTemplate && userMessagesLength >= 5);

    return (
        <>
            <div className="relative group w-full flex flex-col gap-3">
                {hasExistingMessages && (
                    <div className="flex gap-x-2 items-center w-full justify-center">
                        <Button
                            onClick={handleContinueToNewChat}
                            size={'mini'}
                            className="w-fit bg-light/90 text-darker hover:bg-light/80 py-1 px-2.5 font-semibold text-xs rounded-[8px] flex items-center "
                        >
                            continue to new chat
                            <TbExternalLink />
                        </Button>
                        <div
                            className="bg-red-600/40 rounded-[8px] px-2 leading-snug cursor-pointer"
                            onClick={() => {
                                setHasExistingMessages(false);
                                setShowTemplatePanel(false);
                            }}
                        >
                            x
                        </div>
                    </div>
                )}

                <div className="relative rounded-[8px] border border-neutral-800/80 overflow-hidden bg-darkest">
                    <div className="relative flex flex-col">
                        <div className="absolute left-4 top-5 text-neutral-600 font-mono text-sm select-none">
                            &gt;
                        </div>

                        <Textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="create a counter program..."
                            disabled={hasExistingMessages}
                            className={cn(
                                'w-full focus:h-28 h-15 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0 shadow-none',
                                'placeholder:text-neutral-800 placeholder:text-sm resize-none',
                                'focus:outline-none transition-all duration-200',
                                'text-md tracking-wider caret-[#e6e0d4]',
                                hasExistingMessages && 'cursor-not-allowed opacity-50',
                            )}
                            rows={3}
                        />

                        {activeTemplate && !hasExistingMessages && (
                            <div className="mx-3 mb-3">
                                <div className="h-25 w-25 relative rounded-sm overflow-hidden shadow-lg">
                                    <div
                                        onClick={() => resetTemplate()}
                                        className="absolute rounded-full h-4.5 w-4.5 flex justify-center items-center right-1 top-1 text-[13px] z-10 bg-light text-darkest cursor-pointer shadow-sm"
                                    >
                                        <RxCross2 />
                                    </div>
                                    <Image
                                        src={activeTemplate.imageUrl}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute bottom-0 text-[13px] text-darkest w-full bg-light px-1 py-px lowercase truncate font-semibold tracking-wide">
                                        {activeTemplate.title}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-4 py-2.5 ">
                        <div className="flex items-center gap-x-1">
                            <ExecutorSelect value={executor} onChange={setExecutor} />

                            <Button
                                type="button"
                                ref={templateButtonRef}
                                disabled={hasExistingMessages}
                                className={cn(
                                    'group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300',
                                    hasExistingMessages && 'cursor-not-allowed opacity-50',
                                )}
                                onClick={() => setShowTemplatePanel((prev) => !prev)}
                            >
                                <FileCode className="w-3.5 h-3.5 mb-0.5" />
                                <span>templates</span>
                            </Button>

                            <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-mono">
                                <span className={cn(inputValue.length > 200 && 'text-red-500')}>
                                    {inputValue.length}
                                </span>
                                <span className="text-neutral-800">/</span>
                                <span className="text-neutral-700">200</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            disabled={isDisabled}
                            onClick={handleSubmit}
                            className={cn(
                                'group/submit flex items-center gap-2 h-8 w-9 px-2 py-1 rounded-[4px] text-xs font-mono',
                                'disabled:cursor-not-allowed exec-button-dark',
                                inputValue.trim() && activeTemplate
                                    ? 'bg-neutral-800 text-neutral-300 hover:text-neutral-200'
                                    : 'bg-neutral-900 text-neutral-700',
                            )}
                        >
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </div>
                </div>
            </div>

            {showTemplatePanel && !hasExistingMessages && (
                <div ref={templatePanelRef}>
                    <BuilderTemplatesPanel
                        closePanel={() => setShowTemplatePanel(false)}
                        className="max-w-[21rem] bottom-16 left-28"
                        setHasExistingMessages={setHasExistingMessages}
                    />
                </div>
            )}

            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
