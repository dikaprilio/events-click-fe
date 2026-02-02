'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function CTA() {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <section className="py-24 px-6 relative overflow-hidden bg-background">
            {/* Minimalist Background Texture */}
            <div className="absolute inset-0 bg-dots opacity-30 dark:opacity-20 pointer-events-none"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="relative bg-background border border-foreground/10 dark:border-foreground/20 rounded-[2rem] p-8 md:p-16 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] transition-transform duration-300 hover:-translate-y-1">

                    <h2 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-[0.95] tracking-tight">
                        Ready to elevate <br />
                        your brand?
                    </h2>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-medium">
                        We turn bold visions into tangible realities. Let's create something unforgettable together.
                    </p>

                    <div className="flex justify-center">
                        <Link
                            href="https://wa.me/6285156498485?text=Hello%20eventsclick,%20I'd%20like%20to%20start%20a%20project..."
                            target="_blank"
                            onMouseDown={() => setIsPressed(true)}
                            onMouseUp={() => setIsPressed(false)}
                            onMouseLeave={() => setIsPressed(false)}
                            onTouchStart={() => setIsPressed(true)}
                            onTouchEnd={() => setIsPressed(false)}
                            style={{
                                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                            }}
                            className="
                                relative group inline-flex items-center justify-center 
                                w-full md:w-auto min-w-[200px] px-8 py-5 
                                rounded-xl bg-primary text-white 
                                font-bold text-lg tracking-wide 
                                shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
                                dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] 
                                hover:translate-y-[-2px] hover:translate-x-[-2px] 
                                hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] 
                                dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]
                                transition-all duration-200 ease-out
                                active:shadow-none active:translate-x-[2px] active:translate-y-[2px]
                            "
                        >
                            Let's Talk
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 ml-2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
