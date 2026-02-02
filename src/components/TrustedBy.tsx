import Link from 'next/link';
import { clients as defaultClients } from '@/data/clients';

interface TrustedByProps {
    clients?: {
        name: string;
        logo: string;
        slug?: string;
        category?: string;
    }[];
}

export default function TrustedBy({ clients = defaultClients }: TrustedByProps) {
    // Split clients into 4 chunks for the 4 rows
    // If we don't have enough clients, we repeat them to ensure we have content for 4 rows
    // For a smoother loop, we need enough items to fill the screen width + duplicate

    // Helper to ensure we have enough items for a marquee row
    const getRowContent = (source: typeof clients) => {
        // Shuffle or slice for variety if needed, but for now we just use the source
        // We need to duplicate the list to create the infinite scroll effect
        // If the list is short, duplicate it more times
        let content = [...source];
        while (content.length < 10) {
            content = [...content, ...source];
        }
        return [...content, ...content]; // Duplicate for seamless loop
    };

    // Distribute clients across 4 rows with some variety
    const row1 = getRowContent(clients);
    const row2 = getRowContent([...clients].reverse());
    const row3 = getRowContent(clients);
    const row4 = getRowContent([...clients].reverse());

    return (
        <section className="py-24 bg-background border-t border-foreground/5 overflow-hidden">
            <div className="max-w-5xl mx-auto px-6 text-center mb-16">
                <h3 className="font-sans text-sm uppercase tracking-[0.2em] text-primary mb-4 font-bold">Trusted Network</h3>
                <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground">
                    Powering Industry Leaders
                </h2>
            </div>

            <div className="flex flex-col gap-8 md:gap-12">
                {/* Row 1 - Scroll Left */}
                <div className="w-full relative flex overflow-hidden">
                    <div className="flex gap-6 md:gap-8 animate-scroll whitespace-nowrap">
                        {row1.map((client, index) => (
                            <MarqueeItem key={`r1-${index}`} client={client} />
                        ))}
                    </div>
                </div>

                {/* Row 2 - Scroll Right */}
                <div className="w-full relative flex overflow-hidden">
                    <div className="flex gap-6 md:gap-8 animate-scroll-reverse whitespace-nowrap">
                        {row2.map((client, index) => (
                            <MarqueeItem key={`r2-${index}`} client={client} outline />
                        ))}
                    </div>
                </div>

                {/* Row 3 - Scroll Left */}
                <div className="w-full relative flex overflow-hidden">
                    <div className="flex gap-6 md:gap-8 animate-scroll whitespace-nowrap">
                        {row3.map((client, index) => (
                            <MarqueeItem key={`r3-${index}`} client={client} />
                        ))}
                    </div>
                </div>

                {/* Row 4 - Scroll Right */}
                <div className="w-full relative flex overflow-hidden">
                    <div className="flex gap-6 md:gap-8 animate-scroll-reverse whitespace-nowrap">
                        {row4.map((client, index) => (
                            <MarqueeItem key={`r4-${index}`} client={client} outline />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function MarqueeItem({ client, outline = false }: { client: any, outline?: boolean }) {
    return (
        <Link
            href={`/events/${client.slug || '#'}`}
            className={`
                inline-flex items-center justify-center px-8 py-4 rounded-full text-xl md:text-3xl font-display font-bold transition-all duration-300 transform hover:scale-105 whitespace-nowrap
                ${outline
                    ? 'border-2 border-foreground/10 text-foreground/40 hover:text-primary hover:border-primary/50'
                    : 'bg-secondary/50 text-foreground hover:bg-primary hover:text-white'
                }
            `}
        >
            {client.name}
        </Link>
    );
}

