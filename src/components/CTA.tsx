'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTA() {
    return (
        <section className="relative py-32 overflow-hidden bg-background flex flex-col items-center justify-center min-h-[80vh]">
            {/* Idle Animation: Fluid Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                        x: ['-20%', '20%', '-20%'],
                        y: ['-20%', '10%', '-20%']
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute top-1/4 left-1/4 w-[800px] h-[800px] rounded-full bg-primary/20 blur-[150px]"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.2, 0.4, 0.2],
                        x: ['20%', '-20%', '20%'],
                        y: ['20%', '-10%', '20%']
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/10 blur-[150px]"
                />
            </div>

            {/* Overlay grid lines for architectural / event feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-8 w-full"
                >
                    <h2 className="text-5xl sm:text-7xl md:text-[9rem] font-display font-black text-foreground uppercase tracking-tighter leading-[0.85]">
                        Ready to <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 italic font-medium tracking-normal drop-shadow-sm">Elevate?</span>
                    </h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="text-lg md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-16 font-light tracking-wide leading-relaxed"
                >
                    Transforming bold visions into unforgettable realities. Your next extraordinary event starts with a simple conversation.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.4 }}
                >
                    <Link
                        href="https://wa.me/6285156498485?text=Hello%20eventsclick,%20I'd%20like%20to%20start%20a%20project..."
                        target="_blank"
                        className="group relative flex items-center justify-center w-40 h-40 md:w-56 md:h-56 rounded-full bg-background border border-primary/30 overflow-hidden transition-all duration-500 hover:border-primary hover:shadow-[0_0_50px_rgba(0,168,235,0.3)] shadow-[0_8px_32px_rgba(0,0,0,0.1)]"
                    >
                        {/* Idle pulsing border inside */}
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0, 0.4, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 rounded-full border-2 border-primary"
                        />

                        {/* Hover fill using a smooth scale-up circle approach */}
                        <div className="absolute inset-0 bg-primary scale-0 rounded-full transition-transform duration-500 ease-[0.16,1,0.3,1] group-hover:scale-150" />

                        <div className="relative z-10 flex flex-col items-center justify-center">
                            <span className="text-foreground group-hover:text-white font-bold text-lg md:text-xl uppercase tracking-widest transition-colors duration-300">
                                Let's Talk
                            </span>
                            <motion.div
                                animate={{ x: [0, 6, 0] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="mt-3 text-primary group-hover:text-white transition-colors duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </motion.div>
                        </div>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
