import { cn } from '@/src/lib/utils';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Terminal, ArrowRight, FileCode } from 'lucide-react';
import { useState, KeyboardEvent, useRef } from 'react';
import { useUserSessionStore } from '@/src/store/user/useUserSessionStore';
import { useRouter } from 'next/navigation';
import { useBuilderChatStore } from '@/src/store/code/useBuilderChatStore';
import { v4 as uuid } from 'uuid';
import LoginModal from '../utility/LoginModal';
import { ChatRole } from '@/src/types/prisma-types';
import BaseContractTemplatesPanel from './BaseContractTemplatePanel';
import { useActiveTemplateStore } from '@/src/store/user/useActiveTemplateStore';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import Image from 'next/image';
import ExecutorSelect from './ExecutorSelect';
import { RxCross2 } from 'react-icons/rx';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { STAGE } from '@/src/types/stream_event_types';

export default function DashboardTextAreaComponent() {
    const [inputValue, setInputValue] = useState<string>('');
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);
    const router = useRouter();
    const { session } = useUserSessionStore();
    const { setMessage } = useBuilderChatStore();
    const { executor, setExecutor } = useExecutorStore();
    const { activeTemplate, resetTemplate } = useActiveTemplateStore();
    const templateButtonRef = useRef<HTMLButtonElement | null>(null);
    const templatePanelRef = useRef<HTMLDivElement | null>(null);
    useHandleClickOutside([templateButtonRef, templatePanelRef], setShowTemplatePanel);

    function handleSubmit() {
        if (!activeTemplate && inputValue.trim() === '') return;

        if (!session?.user.id) {
            setOpenLoginModal(true);
            return;
        }

        const contractId = uuid();

        if (activeTemplate && activeTemplate.id) {
            setMessage({
                id: uuid(),
                contractId: contractId,
                role: ChatRole.USER,
                content: `Generate ${activeTemplate.id} template for me`,
                stage: STAGE.START,
                isPlanExecuted: false,
                createdAt: new Date(),
            });
        } else {
            setMessage({
                id: uuid(),
                contractId: contractId,
                role: ChatRole.USER,
                content: inputValue,
                stage: STAGE.START,
                isPlanExecuted: false,
                createdAt: new Date(),
            });
        }

        router.push(`/playground/${contractId}`);
    }

    function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    }

    const isDisabled = !inputValue.trim() && !activeTemplate;
    console.log('executor is : ', executor);
    return (
        <>
            <div className="relative group ">
                <div className="absolute -inset-1 bg-linear-to-r from-neutral-600/20 via-neutral-500/20 to-neutral-600/20 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative bg-neutral-950 rounded-lg border border-neutral-800 overflow-visible shadow-2xl">
                    <div className="flex items-center justify-between px-2.5 py-1 md:px-4 md:py-3 border-b border-neutral-800/50 bg-neutral-900/50">
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                                <div className="h-2 w-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-700" />
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-700" />
                                <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-neutral-700" />
                            </div>
                            <div className="flex items-center gap-2 text-neutral-500 text-[10px] md:text-xs font-mono h-full">
                                <Terminal className="w-2 h-2 md:w-3.5 md:h-3.5" />
                                <div className="h-full items-center pt-0.5">winterfell.dev</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-1.5 justify-center">
                            <div
                                className={cn(
                                    'h-1.5 w-1.5 rounded-full transition-colors duration-300 mb-0.5',
                                    isTyping
                                        ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                        : 'bg-neutral-700',
                                )}
                            />
                            <span className="text-[10px] pt-0.5 md:text-xs text-neutral-600 font-mono">
                                {isTyping ? 'active' : 'idle'}
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute left-4 top-5 text-neutral-600 font-mono text-xs md:text-sm select-none">
                            &gt;
                        </div>
                        <Textarea
                            value={inputValue}
                            onChange={(e) => {
                                setInputValue(e.target.value);
                                setIsTyping(e.target.value.length > 0);
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="create a counter contract..."
                            className={cn(
                                'w-full h-20 md:h-28 bg-transparent pl-10 pr-4 py-5 text-neutral-200 border-0',
                                'placeholder:text-neutral-800 placeholder:font-mono placeholder:text-xs md:placeholder:text-sm resize-none',
                                'focus:outline-none transition-all duration-200',
                                'text-md tracking-wider',
                                'caret-[#e6e0d4]',
                            )}
                            rows={3}
                        />

                        {activeTemplate && (
                            <div className="mx-3 mb-3">
                                <div className="h-25 w-25 relative rounded-sm overflow-hidden shadow-lg">
                                    {/* <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setShowTemplatePanel((prev) => !prev);
                                        }}
                                        className='absolute rounded-full h-4.5 w-4.5 flex justify-center items-center right-6.5 top-1 text-xs z-10 bg-light text-dark-base transition-colors transform duration-100 cursor-pointer shadow-sm'>
                                        <SlPencil className='size-2.5' />
                                    </div> */}
                                    <div
                                        onClick={() => resetTemplate()}
                                        className="absolute rounded-full h-4.5 w-4.5 flex justify-center items-center right-1 top-1 text-[13px] z-10 bg-light text-dark-base transition-colors transform duration-100 cursor-pointer shadow-sm"
                                    >
                                        <RxCross2 />
                                    </div>

                                    <Image
                                        src={'/templates/contract-2.jpg'}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    <div className="absolute bottom-0 text-[13px] text-dark-base w-full bg-light px-1 py-px lowercase truncate shadow-lg font-semibold tracking-wide">
                                        {activeTemplate.title}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2.5 border-t border-neutral-800/50 bg-neutral-900/30">
                        <div className="flex items-center gap-1.5 md:gap-3">
                            <ExecutorSelect value={executor} onChange={setExecutor} />
                            <Button
                                onClick={() => setShowTemplatePanel((prev) => !prev)}
                                ref={templateButtonRef}
                                type="button"
                                className="group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                            >
                                <FileCode className="md:w-3.5 md:h-3.5 w-2 h-2 mb-0.5" />
                                <span className="font-mono ">templates</span>
                            </Button>
                            <div className="w-px h-3 bg-neutral-800" />
                            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-neutral-600 font-mono">
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
                                'group/submit flex items-center gap-2 h-6 w-4 md:h-8 md:w-9 px-2 py-1 rounded-[4px] font-mono text-xs duration-200',
                                'transition-all duration-200',
                                inputValue.trim() || activeTemplate
                                    ? 'bg-neutral-800 text-neutral-300 hover:text-neutral-200'
                                    : 'bg-neutral-900 text-neutral-700 cursor-not-allowed',
                            )}
                        >
                            <ArrowRight
                                className={cn(
                                    'md:w-3 md:h-3 w-1 h-1 transition-transform',
                                    (inputValue.trim() || activeTemplate) &&
                                    'group-hover/submit:translate-x-0.5 duration-200',
                                )}
                            />
                        </Button>
                    </div>
                </div>

                {showTemplatePanel && (
                    <div ref={templatePanelRef}>
                        <BaseContractTemplatesPanel
                            closePanel={() => setShowTemplatePanel(false)}
                        />
                    </div>
                )}

                <div className="absolute -bottom-px left-0 right-0 h-px bg-linear-to-r from-transparent via-neutral-600 to-transparent opacity-50" />
            </div>

            <LoginModal opensignInModal={openLoginModal} setOpenSignInModal={setOpenLoginModal} />
        </>
    );
}
