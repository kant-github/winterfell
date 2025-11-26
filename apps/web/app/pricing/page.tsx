'use client';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { BillingPeriod, plans } from '@/src/components/utility/SubscriptionCard';
import { useState } from 'react';
import DustParticles from '@/src/components/base/DustParticles';
import PlanCard from '@/src/components/utility/PlanCard';

export default function PricingPage() {
    const [billing, setBilling] = useState<BillingPeriod>('MONTHLY');

    return (
        <div className="min-h-screen bg-dark-base py-20 px-6 relative">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-6xl font-bold text-white mb-6">Choose Your Plan</h1>
                    <p className="text-2xl text-neutral-400">
                        Select the perfect plan for your needs
                    </p>

                    <div className="flex justify-center mt-10">
                        <div className="relative w-[200px] h-14 border-2 rounded-[4px] border-neutral-800 bg-[#1a1a1a] flex items-center justify-between text-base font-medium">
                            <motion.div
                                className="absolute h-11 w-[94px] rounded-[4px] bg-light"
                                animate={{ left: billing === 'MONTHLY' ? 4 : 100 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                            />

                            <div
                                onClick={function () {
                                    setBilling('MONTHLY');
                                }}
                                className={cn(
                                    'z-10 w-[100px] text-center cursor-pointer transition-colors',
                                    billing === 'MONTHLY' ? 'text-dark-base' : 'text-light',
                                )}
                            >
                                Monthly
                            </div>

                            <div
                                onClick={function () {
                                    setBilling('YEARLY');
                                }}
                                className={cn(
                                    'z-10 w-[100px] text-center cursor-pointer transition-colors',
                                    billing === 'YEARLY' ? 'text-dark-base' : 'text-light',
                                )}
                            >
                                Yearly
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {plans.map(function (planData) {
                        return (
                            <div key={planData.plan}>
                                <PlanCard planData={planData} billing={billing} />
                            </div>
                        );
                    })}
                </div>
            </div>
            <DustParticles particleColor={0xfdf9f0} />
        </div>
    );
}
