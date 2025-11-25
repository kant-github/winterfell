import { MeshGradient } from "@paper-design/shaders-react";
import { BillingPeriod, Plan } from "./SubscriptionCard";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/src/lib/utils";

export default function ExpandableSubscriptionCard({
    onClose,
    plan,
    allPlans,
    onSelectPlan
}: {
    onClose: () => void;
    plan: Plan;
    allPlans: Plan[];
    onSelectPlan: (plan: Plan) => void;
}) {
    const planGradients: Record<string, string[]> = {
        FREE: ['#313647', '#435663', '#393E46', '#686D76'],
        PREMIUM: ['#435663', '#A3B087', '#1D546C', '#FF8040'],
        PREMIUM_PLUS: ['#5100ff', '#62109F', '#6C44FC', '#DC0E0E']
    };

    const [activeBillingPeriod, setActiveBillingPeriod] = useState<BillingPeriod>('MONTHLY');

    const renderFullCard = (planData: Plan, isSelected: boolean, currentIndex: number, selectedIndex: number) => {
        const price = activeBillingPeriod === 'MONTHLY' ? planData.priceMonthly : planData.priceYearly;
        const planName =
            planData.plan === 'PREMIUM_PLUS'
                ? 'Premium+'
                : planData.plan.charAt(0) + planData.plan.slice(1).toLowerCase();

        return (
            <motion.div
                animate={{
                    scale: isSelected ? 1 : 0.95
                }}
                transition={{
                    scale: { duration: 0.3 }
                }}
                onClick={() => !isSelected && onSelectPlan(planData)}
                className={`relative w-screen max-w-[320px] bg-[#1a1a1a] border border-neutral-800 rounded-2xl overflow-hidden transition-all ${!isSelected ? 'cursor-pointer opacity-70 hover:opacity-100 duration-300' : ''
                    }`}
            >
                <div className="relative w-full p-3 rounded-lg overflow-hidden">
                    <MeshGradient
                        colors={planGradients[planData.plan]}
                        distortion={1}
                        swirl={0.8}
                        speed={isSelected ? 0.2 : 0}
                        className="w-full h-30 opacity-80 rounded-[6px]"
                    />
                    <div className="absolute w-full h-full left-0 top-0 flex justify-center items-center">
                        <h2 className="text-[25px] tracking-wide">{planName}</h2>
                    </div>
                </div>

                <div className="w-full flex px-6 py-4 items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-white">{price}</span>
                        <span className="text-sm text-neutral-400">
                            {activeBillingPeriod === 'MONTHLY' ? 'per month' : 'per year'}
                        </span>
                    </div>

                    <div className="relative w-[90px] h-6 border rounded border-neutral-800 bg-dark-base/80 p-1 gap-1 flex items-center justify-between text-[10px]">
                        <motion.div
                            className="absolute h-[18px] w-[39px] rounded-[3px] bg-light"
                            animate={{
                                left: activeBillingPeriod === "MONTHLY" ? 4 : 46,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 25,
                            }}
                        />


                        <div
                            onClick={() => setActiveBillingPeriod("MONTHLY")}
                            className={cn(
                                "z-10 w-[42px] text-center cursor-pointer transition-colors",
                                activeBillingPeriod === "MONTHLY" ? "text-dark-base" : "text-light"
                            )}
                        >
                            Month
                        </div>

                        <div
                            onClick={() => setActiveBillingPeriod("YEARLY")}
                            className={cn(
                                "z-10 w-[42px] text-center cursor-pointer transition-colors",
                                activeBillingPeriod === "YEARLY" ? "text-dark-base" : "text-light"
                            )}
                        >
                            Year
                        </div>
                    </div>
                </div>

                {/* BUTTON */}
                <div className="px-6 pb-4">
                    <Button className="w-full bg-primary hover:bg-primary hover:-translate-y-0.5 ease-in-out text-light font-semibold py-3 rounded-[4px] tracking-wide transition-all">
                        {planData.plan === 'FREE' ? 'Start Free' : 'Try Winterfell'}
                    </Button>
                </div>

                {/* FEATURES */}
                <div className="px-6 pb-6">
                    <p className="text-[13px] text-neutral-500 text-left mb-3 font-medium">
                        {planData.plan === 'FREE'
                            ? 'All features included:'
                            : `All features in ${planData.plan === 'PREMIUM' ? 'Free' : 'Premium'}, plus:`}
                    </p>
                    <div className="space-y-3">
                        {planData.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <Check className="size-4 text-white flex-shrink-0 mt-0.5" />
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="text-sm text-neutral-200">{feature}</span>

                                    {(feature.includes('Unlimited') || feature.includes('AI')) && (
                                        <svg
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="text-neutral-600 flex-shrink-0"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 16v-4M12 8h.01" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-9999 px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-10 w-full max-w-6xl">
                {/* BACK BUTTON */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 left-0 text-neutral-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="group-hover:-translate-x-1 transition-transform"
                    >
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm font-medium">Back</span>
                </button>

                {/* CARDS */}
                <div className="flex items-center justify-center gap-6 flex-wrap lg:flex-nowrap">
                    {allPlans.map((planData, index) => {
                        const selectedIndex = allPlans.findIndex(p => p.plan === plan.plan);
                        return (
                            <div key={planData.plan}>
                                {renderFullCard(planData, planData.plan === plan.plan, index, selectedIndex)}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
