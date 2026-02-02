'use client';

import { useState } from 'react';
import Image from 'next/image';

// Mobile Tags
export const serviceTags = [
    "Product Launching", "Creative Booth Design",
    "Field Activation", "Sampling Programs",
    "Wedding Ceremonies", "Birthday Parties",
    "Concept Development", "Creative Direction",
    "Conferences & Seminars", "Gala Dinners",
    "Technical Management", "Sound & Lighting",
    "LED Screen Solutions", "Live Streaming",
    "Motion Graphics", "Video Documentation"
];

// Desktop Grid: 3x3 Grid (9 Items) matching reference
// Desktop Grid: 3x3 Grid (9 Items) matching reference
export const serviceGridItems = [
    {
        title: "Product Launching",
        image1: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Creative Booth Design",
        image1: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Field Activation",
        image1: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1629904853716-f004b3b08169?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Sampling Programs",
        image1: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Wedding Ceremonies",
        image1: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Birthday Parties",
        image1: "https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Concept Development",
        image1: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Creative Direction",
        image1: "https://images.unsplash.com/photo-1626785774573-4b79931434f3?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?auto=format&fit=crop&w=800&q=80"
    },
    {
        title: "Conferences & Seminars",
        image1: "https://images.unsplash.com/photo-1532153354457-5fbe1a3bb0b4?auto=format&fit=crop&w=400&q=80",
        image2: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=800&q=80"
    }
];

export default function Services() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-5xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-foreground">Signature Services</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto animate-fade-in-up [animation-delay:0.1s]">
                        Tailored solutions to bring your event’s vision to life.
                    </p>
                </div>

                {/* Mobile View: Tag Cloud */}
                <div className="md:hidden flex flex-wrap justify-center gap-3 animate-fade-in-up [animation-delay:0.2s]">
                    {serviceTags.map((tag, i) => (
                        <span
                            key={i}
                            className="bg-secondary border border-foreground/5 shadow-sm px-5 py-2.5 rounded-full text-sm font-medium text-foreground whitespace-nowrap"
                        >
                            {tag}
                        </span>
                    ))}
                    <span className="bg-secondary border border-foreground/5 shadow-sm px-5 py-2.5 rounded-full text-sm font-medium text-muted-foreground whitespace-nowrap">
                        ...and More
                    </span>
                </div>

                {/* Desktop View: Small Thumbnail Grid */}
                <div className="hidden md:grid grid-cols-3 border-collapse mb-12">
                    {serviceGridItems.map((item, index) => (
                        <ServiceCard key={index} item={item} index={index} />
                    ))}
                </div>

                {/* And More Indicator */}
                <div className="hidden md:flex justify-center animate-fade-in-up [animation-delay:0.4s]">
                    <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary/50 border border-dashed border-foreground/20 text-muted-foreground font-medium text-sm">
                        And much more...
                    </span>
                </div>
            </div>
        </section>
    );
}

function ServiceCard({ item, index }: { item: typeof serviceGridItems[0], index: number }) {
    // Grid Border Logic
    const isRightBorder = (index + 1) % 3 !== 0; // 1st & 2nd col
    const isBottomBorder = index < 6;              // 1st & 2nd row

    return (
        <div
            className={`
                group relative flex flex-col items-center justify-center text-center p-8
                ${isRightBorder ? 'border-r border-dashed border-gray-200/50' : ''}
                ${isBottomBorder ? 'border-b border-dashed border-gray-200/50' : ''}
            `}
            style={{ animationDelay: `${0.1 * (index + 2)}s` }}
        >
            {/*
                Thumbnail Stack Container
                - Super small size
            */}
            <div className="relative w-28 h-16 mb-4 z-10">
                {/* Back Card (Left) */}
                <div className="group/card absolute inset-0 bg-white p-0.5 shadow-sm rounded-lg transform transition-all duration-300 ease-out cursor-pointer
                                -rotate-6 -translate-x-3 translate-y-1 scale-95
                                hover:z-50 hover:delay-0 delay-75">
                    <div className="relative w-full h-full rounded bg-gray-100 overflow-hidden">
                        <Image
                            src={item.image2}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Popup Preview (Left) */}
                    <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-[280px] aspect-video bg-white p-1.5 rounded-xl shadow-2xl
                                    opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible
                                    transition-all duration-300 ease-out transform translate-y-2 group-hover/card:translate-y-0 pointer-events-none z-[100]">
                        <div className="relative w-full h-full rounded-lg bg-gray-100 overflow-hidden">
                            <Image
                                src={item.image2}
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Arrow */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45"></div>
                    </div>
                </div>

                {/* Front Card (Right) */}
                <div className="group/card absolute inset-0 bg-white p-0.5 shadow-md rounded-lg transform transition-all duration-300 ease-out cursor-pointer
                                rotate-6 translate-x-3 -translate-y-1 scale-95
                                hover:z-50 hover:delay-0 delay-75">
                    <div className="relative w-full h-full rounded bg-gray-100 overflow-hidden">
                        <Image
                            src={item.image1}
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Popup Preview (Right) */}
                    <div className="absolute bottom-[110%] left-1/2 -translate-x-1/2 w-[280px] aspect-video bg-white p-1.5 rounded-xl shadow-2xl
                                    opacity-0 invisible group-hover/card:opacity-100 group-hover/card:visible
                                    transition-all duration-300 ease-out transform translate-y-2 group-hover/card:translate-y-0 pointer-events-none z-[100]">
                        <div className="relative w-full h-full rounded-lg bg-gray-100 overflow-hidden">
                            <Image
                                src={item.image1}
                                alt=""
                                fill
                                className="object-cover"
                            />
                        </div>
                        {/* Decorative Arrow */}
                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white transform rotate-45"></div>
                    </div>
                </div>
            </div>

            <h3 className="text-sm font-medium text-foreground transition-all duration-300 group-hover:text-primary max-w-[150px] leading-tight">
                {item.title}
            </h3>
        </div>
    );
}
