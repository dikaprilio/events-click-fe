'use client';

const icons = {
    address: (
        <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
    office: (
        <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    phone: (
        <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
    ),
    email: (
        <svg className="w-6 h-6 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
    ),
    youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
    ),
    facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-2.21c0-.837.33-1.05 1-1.05h2.358v-4.58c-.622-.074-1.553-.214-2.589-.214-3.565 0-5.411 1.946-5.411 5.471v2.583z" /></svg>
    )
};

export default function ContactClient() {
    return (
        <div className="pt-20">
            <section className="py-20 text-center bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.1)_0%,transparent_70%)]">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-foreground">Contact Us</h1>
                    <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up [animation-delay:0.1s]">
                        Let's create something unforgettable together.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-10 animate-fade-in-up [animation-delay:0.2s]">
                            <div>
                                <h3 className="text-2xl font-bold text-foreground mb-10">Get in Touch</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            {icons.address}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1">Headquarters</h4>
                                            <p className="text-muted-foreground">Jl. Imam Soeparto No 9 Tembalang, Semarang</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            {icons.office}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1">Branch Office</h4>
                                            <p className="text-muted-foreground">Jl. Majapahit No 221 Pedurungan, Semarang</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            {icons.phone}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1">Phone / WhatsApp</h4>
                                            <p className="text-muted-foreground">+62 851 5649 8485</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            {icons.email}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-foreground mb-1">Email</h4>
                                            <p className="text-muted-foreground">hai@eventsclick.id</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-foreground mb-6">Connect With Us</h3>
                                <div className="flex gap-4">
                                    <a href="#" className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                                        {icons.instagram}
                                    </a>
                                    <a href="#" className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                                        {icons.youtube}
                                    </a>
                                    <a href="#" className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all">
                                        {icons.facebook}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass-card p-10 animate-fade-in-up [animation-delay:0.3s]">
                            <h3 className="text-2xl font-bold text-foreground mb-6">Send us a message</h3>
                            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium text-foreground/80">Name</label>
                                        <input type="text" id="name" className="w-full bg-secondary border border-primary/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all" placeholder="Your name" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium text-foreground/80">Email</label>
                                        <input type="email" id="email" className="w-full bg-secondary border border-primary/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all" placeholder="your@email.com" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="subject" className="text-sm font-medium text-foreground/80">Subject</label>
                                    <input type="text" id="subject" className="w-full bg-secondary border border-primary/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all" placeholder="Project inquiry..." />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium text-foreground/80">Message</label>
                                    <textarea id="message" rows={4} className="w-full bg-secondary border border-primary/10 rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-all" placeholder="Tell us about your event..."></textarea>
                                </div>
                                <button type="submit" className="w-full btn btn-primary">Send Message</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
