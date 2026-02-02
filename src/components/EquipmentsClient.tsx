'use client';

import { useState, useMemo } from 'react';
import { equipmentItems } from '@/data/equipment';

const categories = [
    { id: 'all', label: 'All Equipment' },
    { id: 'sound', label: 'Sound System' },
    { id: 'lighting', label: 'Lighting' },
    { id: 'truss', label: 'Truss & Construction' },
    { id: 'multimedia', label: 'Multimedia' },
];

export default function EquipmentsClient() {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredItems = useMemo(() => {
        if (activeCategory === 'all') return equipmentItems;
        return equipmentItems.filter(item => item.category === activeCategory);
    }, [activeCategory]);

    return (
        <div className="pt-20">
            <section className="py-20 text-center bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.1)_0%,transparent_70%)]">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-foreground">Equipment Rental</h1>
                    <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up [animation-delay:0.1s]">
                        Top-tier audio, visual, and lighting gear for your event production needs.
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredItems.map((item, index) => (
                            <div
                                key={item.id}
                                className="glass-card group overflow-hidden animate-fade-in-up hover:-translate-y-2 hover:border-primary/50"
                                style={{ animationDelay: `${0.1 * (index % 4)}s` }}
                            >
                                <div className="relative h-60 bg-secondary flex items-center justify-center border-b border-primary/10">
                                    {/* Pattern or placeholder */}
                                    <span className="bg-background/80 backdrop-blur text-foreground text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full border border-primary/20">
                                        {item.category}
                                    </span>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
