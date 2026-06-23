
import JsonLd from '@/components/JsonLd';
import Link from 'next/link';
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schema';
import { absoluteUrl } from '@/lib/seo/url';

export const metadata = {
    title: "Event Production Process",
    description: "Proses kerja eventsclick untuk consultation, concept and design, planning, preparation, dan execution event di Indonesia.",
    alternates: {
        canonical: absoluteUrl('/commitment'),
    },
    openGraph: {
        title: "Event Production Process | eventsclick",
        description: "Cara eventsclick merancang dan mengeksekusi event dari konsultasi sampai hari pelaksanaan.",
        url: absoluteUrl('/commitment'),
    },
};


export default function CommitmentPage() {
    const schemas = [
        webPageSchema({
            name: 'Event Production Process',
            description: metadata.description,
            path: '/commitment',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Commitment', path: '/commitment' },
        ]),
    ];

    const steps = [
        {
            number: '01',
            title: 'Consultation',
            description: 'We start by understanding your goals, audience, and vision. We listen carefully to ensure we capture the essence of what you want to achieve.'
        },
        {
            number: '02',
            title: 'Concept & Design',
            description: 'Our creative team develops a tailored concept, including visual design, technical requirements, and a detailed roadmap for your event.'
        },
        {
            number: '03',
            title: 'Planning & Prep',
            description: 'We handle all the logistics, vendor coordination, and technical preparations. We leave no stone unturned to ensure everything is ready.'
        },
        {
            number: '04',
            title: 'Execution',
            description: 'On the big day, our team is on-site to manage every detail, troubleshoot any issues, and ensure a flawless experience for you and your guests.'
        }
    ];

    return (
        <div className="pt-20">
            <JsonLd data={schemas} />
            <section className="py-20 text-center bg-[radial-gradient(circle_at_center,rgba(0,168,235,0.1)_0%,transparent_70%)]">
                <div className="max-w-5xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up text-foreground">Our Commitment</h1>
                    <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up [animation-delay:0.1s]">
                        Dedication to excellence at every step of the journey.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="space-y-12">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row gap-8 md:gap-16 items-start group animate-fade-in-up"
                                style={{ animationDelay: `${0.2 * index}s` }}
                            >
                                <div className="flex-shrink-0">
                                    <span className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-primary/20 to-transparent group-hover:from-primary/40 transition-all duration-500 font-display">
                                        {step.number}
                                    </span>
                                </div>
                                <div className="pt-4 md:pt-8 bg-card/50 p-6 rounded-3xl w-full border border-primary/10 hover:border-primary/30 transition-all">
                                    <h3 className="text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                                    <p className="text-muted-foreground text-lg leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 bg-primary text-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">Ready to start your journey?</h2>
                    <p className="text-xl opacity-90 mb-10">We are committed to making your event a resounding success.</p>
                    <Link href="/contact" className="inline-block bg-white text-primary px-10 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all hover:-translate-y-1 shadow-lg">
                        Work With Us
                    </Link>
                </div>
            </section>
        </div>
    );
}
