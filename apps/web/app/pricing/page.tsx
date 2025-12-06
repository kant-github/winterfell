import DustParticles from '@/src/components/base/DustParticles';
import HomeNavbar from '@/src/components/nav/HomeNavbar';
import PricingHeader from '@/src/components/pricing/PricingHeader';
import PricingSection from '@/src/components/pricing/PricingSection';
import PricingPlanToggleNavbar from '@/src/components/pricing/PricingPlanToggleNavbar';

export default function PricingPage() {
    return (
        <div className="min-h-screen flex flex-col bg-darkest/70 items-center pb-10 relative">
            <HomeNavbar />
            <div className="w-full h-full flex flex-col items-center z-20">
                <PricingHeader />
                <PricingPlanToggleNavbar />
                <PricingSection />
            </div>
            <DustParticles particleColor={0xfdf9f0} />
        </div>
    );
}
