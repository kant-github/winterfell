import { cn } from '@/src/lib/utils';
import { Button } from '../ui/button';
import { FileCode, ArrowRight } from 'lucide-react';
import ExecutorSelect from './ExecutorSelect';
import BaseContractTemplatesPanel from './BaseContractTemplatePanel';
import { EXECUTOR } from '@winterfell/types';
import { IoAddSharp } from 'react-icons/io5';
import React, { useRef, useState } from 'react';
import { useExecutorStore } from '@/src/store/model/useExecutorStore';
import { useHandleClickOutside } from '@/src/hooks/useHandleClickOutside';
import { useTemplateStore } from '@/src/store/user/useTemplateStore';

interface DashboardTextAreaBottomProps {
    inputValue: string;
    handleSubmit: () => void;
}

export default function DashboardTextAreaBottom({ inputValue, handleSubmit }: DashboardTextAreaBottomProps) {
    const fileInputRef = React.useRef<HTMLInputElement | null>(null);
    const { activeTemplate } = useTemplateStore();
    const { executor, setExecutor } = useExecutorStore();
    const templateButtonRef = useRef<HTMLButtonElement | null>(null);
    const templatePanelRef = useRef<HTMLDivElement | null>(null);
    const [showTemplatePanel, setShowTemplatePanel] = useState<boolean>(false);

    useHandleClickOutside([templateButtonRef, templatePanelRef], setShowTemplatePanel);


    const isDisabled = !inputValue.trim() && !activeTemplate;


    return (
        <>
            <div className="flex items-center justify-between px-3 py-1.5 md:px-4 md:py-2.5 border-t border-neutral-800/50 bg-neutral-900/30">
                <div className="flex items-center gap-1.5 md:gap-3">
                    <ExecutorSelect value={executor} onChange={setExecutor} />
                    {/* <Button
                        onClick={handleFileUpload}
                        ref={templateButtonRef}
                        type="button"
                        className="group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                        <IoAddSharp className="md:w-3.5 md:h-3.5 w-2 h-2 mb-0.5" />
                        <span className="font-mono">upload</span>
                    </Button> */}
                    <Button
                        onClick={() => setShowTemplatePanel((prev) => !prev)}
                        ref={templateButtonRef}
                        type="button"
                        className="group/btn bg-transparent hover:bg-transparent flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                    >
                        <FileCode className="md:w-3.5 md:h-3.5 w-2 h-2 mb-0.5" />
                        <span className="font-mono">templates</span>
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
            {showTemplatePanel && (
                <div ref={templatePanelRef}>
                    <BaseContractTemplatesPanel closePanel={() => setShowTemplatePanel(false)} />
                </div>
            )}
        </>
    );
}
