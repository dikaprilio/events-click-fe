'use client';

import Link from 'next/link';
import { portfolioItems } from '@/data/portfolio';
import { useState, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';

const CARD_WIDTH_VW = 70;
const GAP_VW = 2.5; // Tighter gap closer to design
const TOTAL_WIDTH_VW = CARD_WIDTH_VW + GAP_VW;

export default function LatestWorks() {
    const items = portfolioItems;
    // Triping the list: [Buffer Start] [Main Infinite Zone] [Buffer End]
    // rendering 5 sets ensures plenty of runway before needing a reset
    const extendedItems = [...items, ...items, ...items, ...items, ...items];
    const itemsLength = items.length;

    // Start in the middle set (Set 2, index = itemsLength * 2)
    const [index, setIndex] = useState(itemsLength * 2);
    const dragX = useMotionValue(0);

    const onDragEnd = () => {
        const x = dragX.get();
        const DRAG_THRESHOLD = 50;

        if (x <= -DRAG_THRESHOLD) {
            setIndex((pv) => pv + 1);
        } else if (x >= DRAG_THRESHOLD) {
            setIndex((pv) => pv - 1);
        }
    };

    // Infinite Loop Reset Logic
    useEffect(() => {
        // If we drift too far to the edges, snap back to center silently
        // We use a timeout to wait for the spring animation to settle before snapping
        // Ideally this matches the spring duration roughly
        const timeout = setTimeout(() => {
            if (index < itemsLength) {
                // Too far left -> jump to middle equivalent
                // Disable transition here would be ideal, but for MVP React state jump is okay-ish if identical
                setIndex(index + itemsLength * 2);
            } else if (index >= itemsLength * 4) {
                // Too far right -> jump to middle equivalent
                setIndex(index - itemsLength * 2);
            }
        }, 500);
        return () => clearTimeout(timeout);
    }, [index, itemsLength]);

    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="animate-fade-in-up">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">Latest Works</h2>
                        <p className="text-muted-foreground text-lg max-w-xl">
                            Highlights from our recent events and productions.
                        </p>
                    </div>
                    <Link href="/events" className="hidden md:flex btn btn-outline animate-fade-in-up [animation-delay:0.1s]">
                        View All Projects
                    </Link>
                </div>

                {/* Desktop View: Uniform Grid */}
                <div className="hidden md:grid md:grid-cols-3 gap-12">
                    {items.slice(0, 3).map((item, index) => (
                        <WorkCard key={item.slug} item={item} index={index} />
                    ))}
                </div>

                {/* Mobile View: Motion Infinite Carousel */}
                <div className="md:hidden relative h-[500px] flex items-center justify-center overflow-visible">
                    <div className="relative w-full h-[400px] max-w-[100vw] mx-auto overflow-visible">
                        <motion.div
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            style={{ x: dragX }}
                            // Center calculation: (100vw - CARD_WIDTH_VW) / 2
                            // (100 - 70) / 2 = 15vw offset
                            animate={{ translateX: `calc(15vw - ${index * TOTAL_WIDTH_VW}vw)` }}
                            transition={{ type: 'spring', mass: 1, stiffness: 200, damping: 25 }}
                            onDragEnd={onDragEnd}
                            className="flex cursor-grab active:cursor-grabbing items-center gap-[2.5vw]" // Use gap instead of margins
                        >
                            {extendedItems.map((item, i) => {
                                const isActive = index === i;
                                return (
                                    <motion.div
                                        key={`${item.slug}-${i}`}
                                        className="w-[70vw] shrink-0 rounded-[2.5rem] bg-secondary shadow-lg overflow-hidden"
                                        animate={{
                                            scale: isActive ? 1 : 0.9,
                                            opacity: isActive ? 1 : 0.4,
                                            y: isActive ? 0 : 20, // Push inactive cards down slightly for depth
                                        }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                    >
                                        <WorkCard item={item} index={i % itemsLength} isMobile />
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Indicators loops modulo */}
                    <div className="absolute -bottom-12 flex gap-2 justify-center w-full">
                        {items.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setIndex(itemsLength * 2 + i)} // Reset to middle set for consistency
                                className={`h-1.5 rounded-full transition-all duration-300 ${(index % itemsLength) === i ? 'bg-primary w-8' : 'bg-foreground/20 w-2'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

function WorkCard({ item, index, isMobile = false }: { item: any, index: number, isMobile?: boolean }) {
    return (
        <Link
            href={`/events/${item.slug}`}
            className="group relative block w-full outline-none"
            style={{
                animationDelay: !isMobile ? `${0.1 + (0.1 * index)}s` : '0s',
            }}
            // Disable drag propagation for links on mobile to allow swipe
            draggable={false}
        >
            {/* Main Image Container */}
            <div className={`relative aspect-[4/5] overflow-hidden ${isMobile ? '' : 'rounded-[2.5rem] bg-secondary shadow-lg'}`}>
                {/* Note: Mobile card styling is handled by the parent motion.div for cleaner scaling, so we remove shadow/rounding here if mobile to avoid double-borders if needed, OR keep it if parent is structural. 
                   Actually, let's keep simple: The parent motion.div handles scaling. This card just fills it.
                   Using w-full h-full.
                */}
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${item.image})`, backgroundColor: '#18181b' }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute top-6 left-6 z-20">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                        {item.tag}
                    </span>
                </div>

                {/* Floating Info Card */}
                <div className="absolute -bottom-4 -right-2 left-6 z-20 transition-all duration-500 group-hover:-translate-y-2">
                    <div className="bg-background border border-foreground/5 shadow-xl rounded-2xl p-5">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">{item.category}</p>
                                <h3 className="text-lg md:text-xl font-display font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-foreground/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
