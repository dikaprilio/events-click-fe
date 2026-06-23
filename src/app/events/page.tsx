import EventsClient from '@/components/EventsClient';
import JsonLd from '@/components/JsonLd';
import { getAllPosts } from '@/lib/api/posts';
import { breadcrumbSchema, webPageSchema } from '@/lib/seo/schema';
import { absoluteUrl, getPostHeaderImageUrl, getPostSlug, stripHtml } from '@/lib/seo/url';

export const metadata = {
    title: "Event Portfolio Indonesia",
    description: "Portfolio eventsclick untuk corporate events, brand activation, MICE, exhibition, dan creative event production di Indonesia.",
    alternates: {
        canonical: absoluteUrl('/events'),
    },
    openGraph: {
        title: "Event Portfolio Indonesia | eventsclick",
        description: "Lihat karya eventsclick untuk event production, brand activation, corporate events, dan MICE.",
        url: absoluteUrl('/events'),
    },
};

async function getEventsSchemas() {
    try {
        const posts = await getAllPosts({ next: { revalidate: 300 } });
        return [
            webPageSchema({
                type: 'CollectionPage',
                name: 'Event Portfolio Indonesia',
                description: metadata.description,
                path: '/events',
            }),
            {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'eventsclick Event Portfolio',
                itemListElement: posts.slice(0, 50).map((post, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                        '@type': 'CreativeWork',
                        name: post.title,
                        description: stripHtml(post.description),
                        url: absoluteUrl(`/events/${getPostSlug(post)}`),
                        image: getPostHeaderImageUrl(post),
                    },
                })),
            },
            breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Events', path: '/events' },
            ]),
        ];
    } catch {
        return [
            webPageSchema({
                type: 'CollectionPage',
                name: 'Event Portfolio Indonesia',
                description: metadata.description,
                path: '/events',
            }),
            breadcrumbSchema([
                { name: 'Home', path: '/' },
                { name: 'Events', path: '/events' },
            ]),
        ];
    }
}

export default async function EventsPage() {
    const schemas = await getEventsSchemas();

    return (
        <>
            <JsonLd data={schemas} />
            <EventsClient />
        </>
    );
}
