'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';

export default function ExpectationReality() {
    const sectionRef = useRef<HTMLElement>(null);
    
    // Track scroll progress along the 250vh tall section.
    // "start start" = animation starts when top of section hits top of viewport (becomes sticky)
    // "end end" = animation finishes when bottom of section hits bottom of viewport (un-sticks)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // We linearly map the line from 0 to 100 as the user scrolls down this tall section.
    // We add a tiny padding [0.1, 0.9] so it gives them a second to realize it's sticky before moving.
    const sliderPercentage = useTransform(
        scrollYProgress, 
        [0.1, 0.9], 
        [0, 100]
    );
    
    // Create fluid motion templates for the clip-path and the border line
    const clipPath = useMotionTemplate`polygon(0 0, ${sliderPercentage}% 0, ${sliderPercentage}% 100%, 0 100%)`;
    const leftPosition = useMotionTemplate`${sliderPercentage}%`;

    return (
        <section ref={sectionRef} className="h-[250vh] relative bg-background">
            {/* The sticky container locks the content to the screen while we scroll through the 250vh space */}
            <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center overflow-hidden px-6 pt-16">
                
                <div className="max-w-7xl mx-auto mb-8 md:mb-12 text-center w-full">
                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-5xl lg:text-7xl font-bold font-display text-foreground mb-4"
                    >
                        Magic Happens With <span className="text-primary italic">eventsclick</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-medium"
                    >
                        Feel the magic, embrace the vibe. With eventsclick Production,<br className="hidden md:block" />
                        Your event is alive, even before it starts.
                    </motion.p>
                </div>

                <div className="max-w-7xl mx-auto w-full relative">
                    <div className="relative w-full aspect-[4/3] md:aspect-[21/9] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] group max-h-[60vh]">
                        
                        {/* Reality (Back image) */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                            <img 
                                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop" 
                                alt="Reality" 
                                className="w-full h-full object-cover dark:brightness-90"
                                draggable="false"
                            />
                            {/* Dark gradient overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                            
                            {/* Overlay text for Reality */}
                            <div className="absolute top-6 bottom-auto right-6 md:top-12 md:right-12 z-0 hidden md:block">
                                <h3 className="text-4xl sm:text-6xl md:text-[7rem] font-black text-white/40 font-display drop-shadow-lg tracking-widest uppercase mix-blend-overlay">
                                    Reality
                                </h3>
                            </div>
                        </div>

                        {/* Expectation (Front image with dynamic clip-path) */}
                        <motion.div 
                            className="absolute inset-0 w-full h-full will-change-transform pointer-events-none"
                            style={{ clipPath }}
                        >
                            <img 
                                src="https://images.unsplash.com/photo-1549451371-64aa98a6f660?q=80&w=2070&auto=format&fit=crop" 
                                alt="Design" 
                                className="w-full h-full object-cover grayscale-[30%] blur-[1px]" 
                                draggable="false"
                            />
                            {/* Overlay filter to simulate 3D render look slightly */}
                            <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10"></div>
                            
                            {/* Overlay text for Expectation */}
                            <div className="absolute top-6 bottom-auto left-6 md:top-12 md:left-12 hidden md:block">
                                <h3 className="text-4xl sm:text-6xl md:text-[7rem] font-black text-white/40 font-display drop-shadow-lg tracking-widest uppercase mix-blend-overlay">
                                    Design
                                </h3>
                            </div>
                        </motion.div>

                        {/* Main bold labels at bottom */}
                        <div className="absolute bottom-4 md:bottom-12 left-6 md:left-12 pointer-events-none z-10">
                            <motion.h3 
                                className="text-4xl sm:text-7xl md:text-[8rem] font-black text-white font-display drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] tracking-tighter"
                            >
                                Design
                            </motion.h3>
                        </div>

                        <div className="absolute bottom-4 md:bottom-12 right-6 md:right-12 pointer-events-none z-10 text-right">
                            <motion.h3 
                                className="text-4xl sm:text-7xl md:text-[8rem] font-black text-white font-display drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] tracking-tighter"
                            >
                                Reality
                            </motion.h3>
                        </div>

                        {/* Slider Line */}
                        <motion.div 
                            className="absolute top-0 bottom-0 w-1.5 md:w-2 bg-primary z-20 pointer-events-none shadow-[0_0_20px_rgba(0,168,235,0.6)] flex items-center justify-center"
                            style={{ left: leftPosition, x: "-50%" }}
                        >
                            {/* Center Icon */}
                            <div className="absolute w-12 h-12 md:w-20 md:h-20 bg-primary rounded-full shadow-[0_4px_30px_rgba(0,168,235,0.8)] flex items-center justify-center border-4 border-background/20 backdrop-blur-md">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-10 md:h-10 text-white">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" className="rotate-90 origin-center" />
                                </svg>
                            </div>
                        </motion.div>
                    </div>
                    
                    {/* Instruction hint */}
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-[0.3em] pointer-events-none">
                        <span className="mb-2">Keep Scrolling</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
