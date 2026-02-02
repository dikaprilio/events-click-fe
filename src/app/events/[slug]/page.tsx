import { portfolioItems } from '@/data/portfolio';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    return portfolioItems.map((item) => ({
        slug: item.slug,
    }));
}

export const metadata = {
    title: "Project Detail | eventsclick",
};

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = portfolioItems.find((p) => p.slug === slug);

    if (!project) {
        notFound();
    }

    // Get related projects (same category, excluding current)
    const relatedProjects = portfolioItems
        .filter(p => p.category === project.category && p.slug !== project.slug)
        .slice(0, 3);

    return (
        <article className="pt-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] w-full flex items-end">
                {/* Placeholder for project hero image */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 z-0"></div>
                <div className="absolute inset-0 bg-black/40 z-10"></div>

                <div className="relative z-20 max-w-5xl mx-auto px-6 pb-20 w-full animate-fade-in-up">
                    <div className="flex flex-wrap gap-4 mb-4">
                        <span className="bg-primary text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                            {project.category}
                        </span>
                        <span className="bg-white/10 backdrop-blur text-white text-sm font-bold px-4 py-1.5 rounded-full border border-white/20">
                            {project.date}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">{project.title}</h1>
                    <p className="text-xl text-white/90 max-w-3xl drop-shadow-md">{project.description}</p>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-8 animate-fade-in-up [animation-delay:0.2s]">
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-bold mb-6 text-foreground">Project Overview</h2>
                                <p className="text-muted-foreground leading-loose text-lg">
                                    {/* Mock long description */}
                                    This project represents a milestone in {project.category} events.
                                    Our team managed end-to-end production, ensuring every detail aligned with the client's vision.
                                    From concept development to on-site execution, we delivered a seamless experience.
                                </p>
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="h-64 bg-secondary rounded-xl"></div>
                                    <div className="h-64 bg-secondary rounded-xl"></div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 animate-fade-in-up [animation-delay:0.3s]">
                            <div className="glass-card p-8">
                                <h3 className="text-xl font-bold mb-6 text-foreground">Project Details</h3>
                                <dl className="space-y-4">
                                    <div>
                                        <dt className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Client</dt>
                                        <dd className="font-semibold text-foreground text-lg">Partner Client</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Location</dt>
                                        <dd className="font-semibold text-foreground text-lg">Semarang, Indonesia</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Services</dt>
                                        <dd className="font-semibold text-foreground text-lg">Event Production, Management</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
                <section className="py-24 bg-secondary">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-3xl font-bold mb-12 text-foreground">Related Projects</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedProjects.map((item) => (
                                <Link
                                    href={`/events/${item.slug}`}
                                    key={item.slug}
                                    className="group glass-card overflow-hidden block hover:-translate-y-2"
                                >
                                    <div className="h-48 bg-gray-800 relative">
                                        <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors"></div>
                                    </div>
                                    <div className="p-6">
                                        <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.title}</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}
