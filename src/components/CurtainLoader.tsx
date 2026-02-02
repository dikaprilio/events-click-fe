'use client';

import { useEffect, useState } from 'react';

export default function CurtainLoader() {
    const [isVisible, setIsVisible] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Trigger animation after a small delay
        const timer = setTimeout(() => {
            setIsAnimating(true);

            // Remove from DOM after animation completes
            const removeTimer = setTimeout(() => {
                setIsVisible(false);
            }, 800); // Wait for CSS transition

            return () => clearTimeout(removeTimer);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex overflow-hidden pointer-events-none">
            {/* Left Panel */}
            <div
                className={`
                    absolute left-0 top-0 h-full w-1/2 bg-primary transition-transform duration-700 ease-in-out z-20
                    ${isAnimating ? '-translate-x-full' : 'translate-x-0'}
                `}
            />

            {/* Right Panel */}
            <div
                className={`
                    absolute right-0 top-0 h-full w-1/2 bg-zinc-950 transition-transform duration-700 ease-in-out z-20
                    ${isAnimating ? 'translate-x-full' : 'translate-x-0'}
                `}
            />

            {/* Logo / Text centered */}
            <div className={`
                absolute inset-0 flex items-center justify-center z-30 transition-opacity duration-500
                ${isAnimating ? 'opacity-0 scale-110' : 'opacity-100 scale-100'}
            `}>
                <div className="flex flex-col items-center">
                    <span className="text-white font-display text-5xl md:text-7xl font-bold tracking-tighter">
                        events<span className="text-primary-light">click</span>
                    </span>
                    <div className="mt-4 w-12 h-1 bg-white/20 relative overflow-hidden rounded-full">
                        <div className="absolute inset-0 bg-white animate-[shimmer_1.5s_infinite]"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
