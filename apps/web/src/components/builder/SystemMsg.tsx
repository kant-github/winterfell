'use client';
import { cn } from "@/src/lib/utils";
import { Message } from "@/src/types/prisma-types";
import { FILE_STRUCTURE_TYPES, LOADER_STATES, PHASE_TYPES, STAGE } from "@/src/types/stream_event_types";
import { useEffect, useState } from "react";
import { FaListUl } from "react-icons/fa6";
import { CircleDotDashed } from "../ui/animated/circle-dot-dashed";
import { Check } from "lucide-react";

interface StageItem {
    stage: STAGE;
    show: string;
}

const stages: StageItem[] = [
    { stage: STAGE.PLANNING, show: 'Planning' },
    { stage: STAGE.GENERATING_CODE, show: 'Generating Code' },
    { stage: STAGE.BUILDING, show: 'Building' },
    { stage: STAGE.CREATING_FILES, show: 'Structuring Files' },
    { stage: STAGE.FINALIZING, show: 'Finalizing' },
    { stage: STAGE.END, show: 'End' },
];

interface SystemMessageProps {
    message: Message;
    currentPhase?: PHASE_TYPES | FILE_STRUCTURE_TYPES;
    currentFile?: string;
}

export default function SystemMessage({ message, currentPhase, currentFile }: SystemMessageProps) {

    const [currentStage, setCurrentStage] = useState<STAGE>(STAGE.START);

    const showPhases = currentStage === STAGE.GENERATING_CODE;
    const currentStageIndex = stages.findIndex(s => s.stage === currentStage);
    const allCompleted = currentStage === STAGE.END;

    useEffect(() => {
        setCurrentStage(dataFetcher(message));
    }, [message]);

    return (
        <div className="relative w-[80%] rounded-[4px] overflow-hidden border border-neutral-800 bg-[#0e0e0f] text-neutral-300 select-none">
            <div className="px-5 pt-4 flex items-center gap-x-1.5 text-light/90">
                <FaListUl />
                <div>Execution strategy</div>
            </div>
            <div className="relative z-10 w-full flex flex-col gap-y-3 px-5 py-4.5">
                {stages.map(({ stage, show }, index) => {

                    const status = index < currentStageIndex
                        ? LOADER_STATES.COMPLETED
                        : index === currentStageIndex
                            ? LOADER_STATES.BUFFERING
                            : LOADER_STATES.HUNG;

                    const isCompleted = status === LOADER_STATES.COMPLETED;
                    const isBuffering = status === LOADER_STATES.BUFFERING;
                    const isHung = status === LOADER_STATES.HUNG;

                    return (
                        <div key={stage} className="flex items-center gap-x-3">
                            <div
                                className={cn(
                                    'flex items-center justify-center rounded-full transition-all',
                                    isCompleted &&
                                    'border border-green-600 text-green-600 w-3.5 h-3.5 p-0.5',
                                    isBuffering && 'w-4 h-4',
                                    isHung && 'border border-neutral-700 w-4 h-4 p-0.5',
                                )}
                            >
                                {isBuffering ? (
                                    <CircleDotDashed
                                        className="size-4 text-light/70 animate-spin"
                                        shouldAnimate
                                    />
                                ) : isCompleted ? (
                                    <Check strokeWidth={3} className="size-2" />
                                ) : null}
                            </div>

                            <div className="flex flex-col gap-y-1.5">
                                <div
                                    className={cn(
                                        'tracking-wider text-[13px] transition-all',
                                        isHung && 'opacity-50',
                                        isCompleted && 'text-light/70',
                                    )}
                                >
                                    {show}
                                </div>

                                {stage === STAGE.GENERATING_CODE &&
                                    currentStage === STAGE.GENERATING_CODE && (
                                        <div className="pl-5 text-xs opacity-50">editing files</div>
                                    )}
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}

function dataFetcher(message: Message) {

    let currentStage: STAGE;

    if (message.error) currentStage = STAGE.ERROR;
    else if (message.End) currentStage = STAGE.END;
    else if (message.finalzing) currentStage = STAGE.FINALIZING;
    else if (message.creatingFiles) currentStage = STAGE.CREATING_FILES;
    else if (message.building) currentStage = STAGE.BUILDING;
    else if (message.generatingCode) currentStage = STAGE.GENERATING_CODE;
    else if (message.planning) currentStage = STAGE.PLANNING;
    else currentStage = STAGE.START;

    return currentStage;

}