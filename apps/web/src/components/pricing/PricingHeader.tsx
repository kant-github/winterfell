export default function PricingHeader() {
    return (
        <div className="mt-18 tracking-wider flex flex-col items-center w-full max-w-[70%] gap-y-4 select-none">
            {/* <div className="border border-primary-light bg-primary/5 px-2.5 py-1 pt-1.5 rounded-[4px] text-sm font-light leading-none text-primary-light">
                SUBSCRIPTION PLANS
            </div> */}

            <div className="flex flex-col gap-y-4 items-center">
                <div className="text-7xl font-semibold leading-[55px] text-transparent bg-clip-text bg-linear-to-t from-light/30 via-light/70 to-light tracking-wide">
                    Winterfell Plans
                </div>
                <div className="text-[20px] text-light/60 flex flex-col">
                    <span>
                        Pricing as efficient as your smart contracts, whether you&apos;re prototyping or
                        scaling DeFi programs,
                    </span>
                    <span>Winterfell adapts with AI tooling and seamless deployment.</span>
                </div>
            </div>
        </div>
    );
}
