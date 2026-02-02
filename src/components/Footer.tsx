'use client';

import Link from 'next/link';
import Image from 'next/image';

const icons = {
    instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
    ),
    youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
    ),
    location: (
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    building: (
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    )
};

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-secondary border-t border-primary/10 pt-20 pb-8 mt-auto">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-bold text-foreground">eventsclick</h3>
                        <p className="text-muted-foreground text-lg leading-relaxed max-w-xs">
                            Elevating brands through premium and unforgettable event experiences.
                        </p>
                        <div className="text-muted-foreground text-sm space-y-3">
                            <div className="flex gap-2">
                                <span className="mt-0.5">{icons.location}</span>
                                <p>Jl. Imam Soeparto No 9 Tembalang</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="mt-0.5">{icons.location}</span>
                                <p>Jl. Majapahit No 221 Pedurungan</p>
                            </div>
                            <div className="flex gap-2">
                                <span className="mt-0.5">{icons.building}</span>
                                <p>Semarang, Central Java</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h4 className="font-display text-base text-foreground font-bold uppercase tracking-wider mb-6">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Home</Link></li>
                            <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">About Us</Link></li>
                            <li><Link href="/events" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Our Works</Link></li>
                            <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-display text-base text-foreground font-bold uppercase tracking-wider mb-6">Services</h4>
                        <ul className="space-y-4">
                            <li><Link href="/events?cat=activation" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Brand Activation</Link></li>
                            <li><Link href="/events?cat=conference" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Corporate Events</Link></li>
                            <li><Link href="/equipments" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Equipment Rental</Link></li>
                            <li><Link href="/services" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Full Service</Link></li>
                        </ul>
                    </div>

                    {/* Social / Sub-brands */}
                    <div>
                        <h4 className="font-display text-base text-foreground font-bold uppercase tracking-wider mb-6">Sub-Brands</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Giga Studio</a></li>
                            <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-[15px]">Giga Photobooth</a></li>
                            <li className="pt-4">
                                <div className="flex gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                        {icons.instagram}
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all">
                                        {icons.youtube}
                                    </a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm">&copy; {currentYear} PT Majelis Inovatif Kreasi Bangsa. All rights reserved.</p>
                    <div className="flex gap-8 text-xs text-muted-foreground uppercase tracking-widest">
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
