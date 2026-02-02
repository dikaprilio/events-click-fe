'use client';

import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative h-screen min-h-[600px] w-full overflow-hidden flex items-center justify-center">
            {/* Fallback Theme-based Background */}
            <div className="absolute inset-0 bg-background transition-colors duration-500"></div>

            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    className="w-full h-full object-cover"
                    src="/stock-footage.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                ></video>
                {/* Dynamic Overlay: White/80 in Light, Black/80 in Dark */}
                <div className="absolute inset-0 bg-background/80 z-10 transition-colors duration-500"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.15)_0%,transparent_70%)] z-11"></div>
            </div>

            <div className="relative z-20 text-center px-6 max-w-5xl animate-fade-in-up">
                <h1 className="text-5xl md:text-8xl font-bold mb-8 text-foreground drop-shadow-sm font-display tracking-tight leading-[1.1]">
                    Elevating brands through <span className="text-primary italic">unforgettable</span> events
                </h1>
                <p className="text-xl md:text-2xl font-light text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
                    Semarang’s leading event production partner, delivering state-of-the-art experiences with precision and creativity.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/events" className="btn btn-primary min-w-[200px] shadow-xl">
                        Explore Works
                    </Link>
                    <Link href="/contact" className="btn btn-outline min-w-[200px] backdrop-blur-sm">
                        Start a Project
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute top-156 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 text-xs font-medium tracking-[0.2em] uppercase z-20 animate-float opacity-70">
                <span>Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent"></div>
            </div>
        </section>
    );
}
