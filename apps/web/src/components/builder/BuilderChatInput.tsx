import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { ArrowRight, FileCode } from 'lucide-react';
import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useParams } from 'next/navigation';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { v4 as uuid } from 'uuid';
import LoginModal from '../utility/LoginModal';
import ExecutorSelect from '../base/ExecutorSelect';
import { ChatRole } from '@/src/types/prisma-types';
import { toast } from 'sonner';
import GenerateContract from '@/src/lib/server/generate_contract';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { STAGE } from '@/src/types/stream_event_types';
import BaseContractTemplatesPanel from '../base/BaseContractTemplatePanel';
import axios from 'axios';
import { GET_CURRENT_CONTRACT_DATA_URL } from '@/routes/api_routes';

export default function BuilderChatInput() {
    const [inputValue, setInputValue] = useState<string>('');
    const { executor, setExecutor } = useExecutorStore();
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const { session } = useUserSessionStore();
    const { messages, setMessage } = useBuilderChatStore();
    const params = useParams();
    const contractId = params.contractId as string;
    const templateButtonRef = useRef<HTMLButtonElement | null>(null);
    const templatePanelRef = useRef<HTMLDivElement | null>(null);
    const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);

    async function handleSubmit() {
        try {
            const messageContent = inputValue.trim();

            if (messageContent === '') return;

            if (!session?.user.id) {
                setOpenLoginModal(true);
                return;
            }

            // Clear input immediately
            setInputValue('');

            // Add user message to the store
            setMessage({
                id: uuid(),
                contractId: contractId,
                role: ChatRole.USER,
                stage: STAGE.START,
                content: messageContent,
                isPlanExecuted: false,
                createdAt: new Date(),
            });

            if (useBuilderChatStore.getState().messages.length < 2) return;

            // call the agentic
            await GenerateContract.start_agentic_executor(
                session.user.token || '',
                contractId,
                messageContent,
            );
        } catch (error) {
            console.error('Chat stream error:', error);
            toast.error('An unexpected error occurred');
        }
    }

    const userMessagesLength = messages.filter((m) => m.role === ChatRole.USER).length;

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        // if(userMessagesLength >= 5) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    async function handleClick() {
        if (!session || !session.user.token) return;
        const response = await axios.post(
            GET_CURRENT_CONTRACT_DATA_URL,
            {
                contractId,
            },
            {
                headers: {
                    Authorization: `Bearer ${session?.user.token}`,
                },
            },
        );
        console.log('response with: ', response.data);
    }

    return (
        <>
            <div className="relative group w-full">
                <div className="relative rounded-[8px] border border-neutral-800/80 overflow-hidden bg-darkest">
                    <div className="relative">
                        <div className="absolute left-4 top-5 text-neutral-600 font-mono text-sm select-none">
                            &gt;
                        </div>
                        <Textarea
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="create a counter program..."
                            className={cn(
                                'w-full focus:h-28 h-15 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0 shadow-none',
                                'placeholder:text-neutral-800  placeholder:text-sm resize-none',
                                'focus:outline-none transition-all duration-200',
                                'text-md tracking-wider',
                                'caret-[#e6e0d4]',
                            )}
                            rows={3}
                        />
                    </div>

                    <div className="flex items-center justify-between px-4 py-2.5 ">
                        <div className="flex items-center gap-x-1">
                            <ExecutorSelect value={executor} onChange={setExecutor} />
                            <Button
                                type="button"
                                ref={templateButtonRef}
                                className="group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                                onClick={() => {
                                    setShowTemplatePanel((prev) => !prev);
                                    handleClick();
                                }}
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
                            disabled={!inputValue.trim() || userMessagesLength >= 5}
                            onClick={handleSubmit}
                            className={cn(
                                'group/submit flex items-center gap-2 h-8 w-9 px-2 py-1 rounded-[4px] font-mono text-xs duration-200',
                                'transition-all duration-200',
                                'disabled:cursor-not-allowed exec-button-dark',
                                inputValue.trim()
                                    ? 'bg-neutral-800 text-neutral-300 hover:text-neutral-200'
                                    : 'bg-neutral-900 text-neutral-700 cursor-not-allowed',
                            )}
                        >
                            <ArrowRight className={cn('w-3 h-3 transition-transform')} />
                        </Button>
                    </div>
                </div>
            </div>

            {showTemplatePanel && (
                <div ref={templatePanelRef} className="">
                    <BaseContractTemplatesPanel
                        closePanel={() => setShowTemplatePanel(false)}
                        className="max-w-[21rem] bottom-16 left-28"
                    />
                </div>
            )}

            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
