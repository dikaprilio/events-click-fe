'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { portfolioItems } from '@/data/portfolio';

const categories = [
    { id: 'all', label: 'All Events' },
    { id: 'activation', label: 'Activation' },
    { id: 'social', label: 'Social' },
    { id: 'conference', label: 'Conference' },
    { id: 'exhibition', label: 'Exhibition' },
];

export default function EventsClient() {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredItems = useMemo(() => {
        if (activeCategory === 'all') return portfolioItems;
        return portfolioItems.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="pt-20">
            <section className="py-20 text-center bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.1)_0%,transparent_70%)]">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-foreground">Our Works</h1>
                    <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up [animation-delay:0.1s]">
                        Discover our portfolio of unforgettable events and activations.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    {/* Filters */}
                    <div className="flex justify-center flex-wrap gap-3 mb-16 animate-fade-in-up [animation-delay:0.2s]">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`px-6 py-2 rounded-full border text-sm font-medium transition-all duration-300 ${activeCategory === cat.id
                                    ? 'bg-primary border-primary text-white'
                                    : 'bg-transparent border-primary/20 text-muted-foreground hover:border-primary hover:text-primary'
                                    }`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {filteredItems.map((item, index) => (
                            <Link
                                href={`/events/${item.slug}`}
                                key={item.slug}
                                className="group glass-card overflow-hidden transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
                                style={{ animationDelay: `${0.1 * (index % 3)}s` }}
                            >
                                <div className="relative h-60 bg-secondary overflow-hidden">
                                    {/* Placeholder gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 group-hover:scale-105 transition-transform duration-500"></div>

                                    <div className="absolute inset-0 bg-primary/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white font-semibold uppercase tracking-wider border-2 border-white rounded-full px-6 py-3">View Project</span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-3 text-xs font-semibold uppercase">
                                        <span className="text-primary">{item.tag}</span>
                                        <span className="text-muted-foreground">{item.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                                    <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-2">{item.description}</p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredItems.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground text-lg">
                            <p>No projects found in this category yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
