
export const metadata = {
    title: "About Us | eventsclick",
    description: "Learn about eventsclick, our history, and our team."
};


export default function AboutPage() {
    return (
        <div className="pt-20">
            <section className="py-20 text-center bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.1)_0%,transparent_70%)]">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-foreground">About eventsclick</h1>
                    <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up [animation-delay:0.1s]">
                        Your partner in creating unforgettable experiences.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="animate-fade-in-up [animation-delay:0.2s] relative rounded-2xl overflow-hidden aspect-video bg-secondary">
                            {/* Image Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-display font-bold text-3xl">
                                Team Photo
                            </div>
                        </div>

                        <div className="space-y-6 animate-fade-in-up [animation-delay:0.3s]">
                            <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Founded with a passion for excellence in event production, eventsclick has grown into a premier provider of full-service event solutions in Semarang and beyond. We believe that every event is a unique opportunity to tell a story, connect people, and create lasting memories.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                Our team of dedicated professionals brings together expertise in creative design, technical production, and logistical planning to ensure seamless execution. Whether it's a corporate gala, a brand activation, or a private celebration, we approach every project with the same level of commitment and attention to detail.
                            </p>

                            <div className="grid grid-cols-3 gap-6 pt-6">
                                <div>
                                    <h4 className="text-4xl font-bold text-primary mb-1">500+</h4>
                                    <p className="text-sm text-foreground/80">Events Managed</p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-bold text-primary mb-1">50+</h4>
                                    <p className="text-sm text-foreground/80">Corporate Clients</p>
                                </div>
                                <div>
                                    <h4 className="text-4xl font-bold text-primary mb-1">100%</h4>
                                    <p className="text-sm text-foreground/80">Satisfaction</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Location Section */}
            <section className="py-24 bg-secondary">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-10 text-foreground">Our Headquarters</h2>
                    <div className="glass-card p-2 md:p-4 aspect-[21/9] w-full relative overflow-hidden">
                        {/* Map Placeholder */}
                        <div className="w-full h-full bg-background rounded-xl flex items-center justify-center text-muted-foreground">
                            Interactive Map Loading...
                        </div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                        <div>
                            <h4 className="font-bold text-xl text-foreground mb-2">Semarang Office</h4>
                            <p className="text-muted-foreground">Jl. Imam Soeparto No 9 Tembalang, Semarang, Jawa Tengah</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-xl text-foreground mb-2">Workshop</h4>
                            <p className="text-muted-foreground">Jl. Majapahit No 221 Pedurungan, Semarang, Jawa Tengah</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
