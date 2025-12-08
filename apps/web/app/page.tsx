'use client';
import Features from '@/src/components/base/Features';
import Footer from '@/src/components/base/Footer';
import Hero from '@/src/components/base/Hero';
import WhoWeAre from '@/src/components/base/WhoWeAre';
import LenisProvider from '@/src/providers/LenisProvider';
import Navbar from '@/src/components/nav/Navbar';
import SubscriptionPlans from '@/src/components/utility/SubscriptionCard';
import Faq from '@/src/components/base/Faq';
import ReviewsSection from '@/src/components/utility/ReviewsSection';
import { useEffect, useRef } from 'react';

export default function Page() {
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        function focusInput(e: KeyboardEvent) {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (inputRef.current && e.key.length === 1) {
                inputRef.current.focus();
            }
        }
        document.addEventListener('keydown', focusInput);
        return () => {
            document.removeEventListener('keydown', focusInput);
        };
    }, []);
    return (
        <LenisProvider>
            <div className="min-h-screen w-full flex flex-col bg-dark relative select-none">
                <Navbar />
                <Hero inputRef={inputRef} />
                <Features />
                <WhoWeAre />
                <ReviewsSection />
                <SubscriptionPlans />
                <Faq />
                <Footer />
            </div>
        </LenisProvider>
    );
}
