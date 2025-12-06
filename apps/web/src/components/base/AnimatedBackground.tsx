'use client';

import { useEffect } from 'react';

interface AnimatedBackgroundProps {
    projectId?: string;
    height?: string;
    alphaMask?: string;
    className?: string;
}

export default function AnimatedBackground({
    projectId = 'GE8mpmmCRgK6XBF57jgF',
    height = '760px',
    alphaMask = '80',
    className = '',
}: AnimatedBackgroundProps) {
    useEffect(() => {
        // Load UnicornStudio script
        if (!(window as any).UnicornStudio) {
            (window as any).UnicornStudio = {
                isInitialized: false,
                init: () => {}, // Placeholder, will be replaced by the script
            };
            const script = document.createElement('script');
            script.src =
                'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js';
            script.onload = () => {
                if (!(window as any).UnicornStudio.isInitialized) {
                    (window as any).UnicornStudio.init();
                    (window as any).UnicornStudio.isInitialized = true;
                }
            };
            (document.head || document.body).appendChild(script);
        }
    }, []);

    return (
        <>
            {/* Gradient Blur Overlay */}
            <div className="gradient-blur">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            {/* Animated Background */}
            <div
                className={`-z-10 w-full absolute top-0 ${className}`}
                data-alpha-mask={alphaMask}
                style={{
                    height,
                    maskImage: `linear-gradient(to bottom, transparent, black 0%, black ${alphaMask}%, transparent)`,
                    WebkitMaskImage: `linear-gradient(to bottom, transparent, black 0%, black ${alphaMask}%, transparent)`,
                }}
            >
                <div
                    data-us-project={projectId}
                    className="absolute w-full h-full left-0 top-0 -z-10"
                ></div>
            </div>
        </>
    );
}
