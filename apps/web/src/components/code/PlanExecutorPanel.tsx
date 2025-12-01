'use client'
import { JSX, useState } from "react";
import { RiListCheck2 } from "react-icons/ri";
import { GiBookmarklet } from "react-icons/gi";
import { FaCheckDouble } from "react-icons/fa6";
import { cn } from "@/src/lib/utils";
import { Button } from "../ui/button";

const data = [
    {
        selected: false,
        title: "Initialize Pool",
        description: "Creates a new DLMM pool with the required configuration and state accounts."
    },
    {
        selected: false,
        title: "Initialize Position",
        description: "Opens a new liquidity position for a user within the pool’s bins."
    },
    {
        selected: false,
        title: "Add Liquidity",
        description: "Deposits tokens into selected price bins to increase the user's liquidity position."
    },
    {
        selected: false,
        title: "Remove Liquidity",
        description: "Withdraws liquidity from the user’s selected bins, returning tokens."
    },
    {
        selected: false,
        title: "Swap Tokens",
        description: "Executes a token swap using the pool’s concentrated liquidity across bins."
    },
    {
        selected: false,
        title: "Collect Fees",
        description: "Collects accumulated trading fees earned from providing liquidity."
    },
]

interface PlanExecutorPanelProps {
    className?: string
}

export default function PlanExecutorPanel({ className }: PlanExecutorPanelProps): JSX.Element {
    const [instructions, setInstructions] = useState(data);

    function toggleSelected(index: number) {
        setInstructions(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, selected: !item.selected } : item
            )
        );
    }

    function toggleSelectAll() {
        const allSelected = instructions.every(item => item.selected);

        setInstructions(prev =>
            prev.map(item => ({
                ...item,
                selected: !allSelected
            }))
        );
    }

    const allSelected = instructions.every(item => item.selected);

    return (
        <div className={cn("h-full w-full pb-4 p-2 tracking-wide text-left", className)}>
            <div className="text-left text-xs">planner context</div>
            <div className="max-w-lg mx-auto border border-neutral-800 rounded-[8px] bg-[#1b1d20] px-4 py-2 pb-3.5 mt-4">
                <div className="flex items-center justify-start gap-x-2 text-light/70">
                    <RiListCheck2 className="size-3" />
                    <span className="text-[11px] font-semibold">
                        580f57fd-abd8-4487-90f1-777527d2abac.plan.md
                    </span>
                </div>

                <h1 className="text-2xl font-bold text-left mt-3">Dlmm Pool Smart Contract</h1>
                <p className="text-left text-[13px] text-light/70 mt-1">
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur sint odit vel eligendi est enim id itaque, temporibus nam animi ea quo magnam amet veritatis eos?
                </p>

                <div className="text-[#80a1c2] text-left text-[11px] mt-2 pl-1 hover:underline cursor-pointer">
                    read detailed plan
                </div>

                <div className="w-full border border-neutral-800 rounded-[6px] bg-[#16171a] px-3 pb-3 pt-2 mt-1 relative">
                    <div className="text-xs text-light/70 flex items-center justify-start gap-x-2">
                        <GiBookmarklet className="text-light/70 size-3 mt-0.5" />
                        <span>instructions</span>
                    </div>

                    <Button
                        size={'mini'}
                        variant={'ghost'}
                        className={cn("text-light absolute top-2 right-2 gap-x-2 hover:bg-[#16171a] bg-[#16171a]",
                            !allSelected ? "text-light/40  hover:text-light/40" : "text-light hover:text-light"
                        )}
                        onClick={toggleSelectAll}
                    >
                        <FaCheckDouble className="size-2" />
                        <span className="text-xs">
                            {allSelected ? "selected all" : "select all"}
                        </span>
                    </Button>

                    <div className="flex flex-col gap-y-4 mt-3">
                        {instructions.map((ins, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-x-2.5 cursor-pointer"
                                onClick={() => toggleSelected(index)}
                            >
                                <span className={cn(
                                    "h-3 w-3 aspect-square border border-neutral-800 rounded-full bg-dark",
                                    ins.selected && "bg-light"
                                )} />

                                <div className="flex flex-col -mt-1">
                                    <span
                                        className={cn(
                                            "text-[13px]",
                                            ins.selected && "line-through text-light/40"
                                        )}
                                    >
                                        {ins.title}
                                    </span>

                                    <span className="text-[12px] text-light/70">
                                        {ins.description}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}
