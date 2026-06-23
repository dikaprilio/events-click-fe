import ContactClient from '@/components/ContactClient';
import JsonLd from '@/components/JsonLd';
import { breadcrumbSchema, localBusinessSchema, organizationSchema, webPageSchema } from '@/lib/seo/schema';
import { absoluteUrl } from '@/lib/seo/url';

export const metadata = {
    title: "Contact eventsclick",
    description: "Hubungi eventsclick untuk event organizer, corporate events, brand activation, MICE, dan equipment rental di Indonesia.",
    alternates: {
        canonical: absoluteUrl('/contact'),
    },
    openGraph: {
        title: "Contact eventsclick",
        description: "Mulai diskusi event bersama eventsclick, event production partner berbasis Semarang.",
        url: absoluteUrl('/contact'),
    },
};

export default function ContactPage() {
    const schemas = [
        organizationSchema(),
        localBusinessSchema(),
        webPageSchema({
            type: 'ContactPage',
            name: 'Contact eventsclick',
            description: metadata.description,
            path: '/contact',
        }),
        breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Contact', path: '/contact' },
        ]),
    ];

    return (
        <>
            <JsonLd data={schemas} />
            <ContactClient />
        </>
    );
}
