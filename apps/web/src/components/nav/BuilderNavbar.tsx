'use client';
import { LiaServicestack } from 'react-icons/lia';
import BuilderNavbarSearchComponent from './BuilderNavbarSearchComponent';
import BuilderNavbarRightSection from './BuilderNavbarRightSection';

export default function BuilderNavbar() {
    return (
        <div className="min-h-[3.5rem] bg-dark-base text-light/70 px-6 select-none relative flex items-center justify-between">
            <div className="text-[#C3C3C3] text-sm tracking-[0.5rem] flex justify-start items-center gap-x-3 cursor-pointer group">
                <LiaServicestack size={25} className="text-primary" />
                WINTERFELL
            </div>

            <BuilderNavbarSearchComponent />
            <BuilderNavbarRightSection />
        </div>
    );
}
