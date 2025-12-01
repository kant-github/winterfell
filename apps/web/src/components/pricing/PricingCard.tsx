'use client';
import { GoArrowUpRight, GoCheck } from 'react-icons/go';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';

interface PricingCardProps {
    icon: React.ReactElement;
    description: string;
    planType: string;
    tagTitle?: string;
    price: string;
    features: string[];
}

export default function PricingCard({
    icon,
    planType,
    price,
    description,
    tagTitle,
    features,
}: PricingCardProps) {
    return (
        <div className="w-110 h-full min-h-140 rounded-lg select-none border tracking-wide shadow-sm hover:shadow-md hover:border-primary/40 transition-colors duration-200 border-neutral-800 bg-linear-to-br from-dark via-dark-base to-dark p-8 flex flex-col gap-y-7">
            <div className="flex justify-between items-center text-light/80">
                <div className="flex gap-x-2 items-center">
                    {icon}
                    <div className="font-semibold text-[24px] pt-0.5 leading-0">{planType}</div>
                </div>

                {tagTitle && (
                    <div
                        className={cn(
                            'text-[14px] px-2.5 py-0.5 pt-[3px] rounded-[4px] tracking-wider font-semibold opacity-95',
                            planType === 'Premium Plus'
                                ? 'bg-light text-dark-base'
                                : planType === 'Premium'
                                  ? 'bg-primary text-light'
                                  : 'bg-neutral-800 text-light',
                        )}
                    >
                        {tagTitle}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start gap-y-2">
                <div className="text-4xl tracking-wider font-semibold">{price}</div>
                <div className="text-light/70 text-[21px] text-left">{description}</div>
            </div>

            <Button
                className={cn(
                    'font-semibold text-base hover:-translate-y-0.5 ease-in-out transform tracking-wide !py-5 !rounded-[4px]',
                    planType === 'Free'
                        ? 'bg-neutral-800/80 text-light hover:bg-[#1d1d1d]'
                        : 'bg-light hover:bg-light text-dark-base',
                )}
            >
                {planType === 'Free' ? 'Jump In' : 'Get Started'}
                <GoArrowUpRight />
            </Button>

            <div className="border-t border-light/14" />

            <div className="text-left flex flex-col gap-y-3">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="text-light/70 shadow-xs px-2.5 py-1  text-sm font-light rounded-full bg-dark w-fit flex items-center gap-x-1.5"
                    >
                        <div>
                            <GoCheck />
                        </div>
                        <div>{feature}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
