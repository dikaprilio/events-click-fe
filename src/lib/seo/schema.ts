import { siteConfig } from './site';
import { absoluteUrl, getDefaultOgImageUrl, getPostHeaderImageUrl, getPostSlug, stripHtml, trimText } from './url';
import { Post } from '@/types/post';
import { Equipment } from '@/types/equipment';
import { FaqItem } from '@/lib/api/faqs';
import { DynamicPage } from '@/lib/api/dynamic-pages';
import { getImageUrl } from '@/lib/utils';

type JsonLdObject = Record<string, unknown>;

const organizationId = absoluteUrl('/#organization');
const localBusinessId = absoluteUrl('/#local-business');
const websiteId = absoluteUrl('/#website');

function compact<T extends JsonLdObject>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      if (entry === undefined || entry === null || entry === '') return false;
      if (Array.isArray(entry) && entry.length === 0) return false;
      return true;
    })
  ) as T;
}

function postalAddress(address: (typeof siteConfig.addresses)[number]): JsonLdObject {
  return compact({
    '@type': 'PostalAddress',
    streetAddress: address.streetAddress,
    addressLocality: address.addressLocality,
    addressRegion: address.addressRegion,
    addressCountry: address.addressCountry,
  });
}

export function organizationSchema(): JsonLdObject {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': organizationId,
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(siteConfig.logo),
    image: getDefaultOgImageUrl(),
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    address: siteConfig.addresses.map(postalAddress),
    sameAs: siteConfig.socialLinks,
  });
}

export function localBusinessSchema(): JsonLdObject {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': localBusinessId,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    image: getDefaultOgImageUrl(),
    logo: absoluteUrl(siteConfig.logo),
    telephone: siteConfig.contact.phone,
    address: siteConfig.addresses.map(postalAddress),
    areaServed: [
      { '@type': 'Country', name: 'Indonesia' },
      { '@type': 'AdministrativeArea', name: 'Jawa Tengah' },
      { '@type': 'City', name: 'Semarang' },
    ],
    parentOrganization: { '@id': organizationId },
  });
}

export function websiteSchema(): JsonLdObject {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: ['id-ID', 'en-US'],
    publisher: { '@id': organizationId },
  });
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>): JsonLdObject {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

export function webPageSchema(params: {
  name: string;
  description?: string;
  path: string;
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage';
  image?: string;
}): JsonLdObject {
  return compact({
    '@context': 'https://schema.org',
    '@type': params.type || 'WebPage',
    name: params.name,
    description: params.description,
    url: absoluteUrl(params.path),
    image: params.image,
    inLanguage: ['id-ID', 'en-US'],
    isPartOf: { '@id': websiteId },
    publisher: { '@id': organizationId },
  });
}

export function faqPageSchema(faqs: FaqItem[]): JsonLdObject | null {
  const visibleFaqs = faqs.filter((faq) => faq.question && faq.answer).slice(0, 7);
  if (visibleFaqs.length < 3) return null;

  return compact({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: visibleFaqs.map((faq) => ({
      '@type': 'Question',
      name: stripHtml(faq.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  });
}

export function videoObjectSchema(videoUrl?: string): JsonLdObject | null {
  if (!videoUrl) return null;
  const absoluteVideoUrl = videoUrl.startsWith('http') ? videoUrl : absoluteUrl(videoUrl);

  return compact({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'eventsclick event production highlight',
    description: siteConfig.description,
    uploadDate: '2026-01-01',
    contentUrl: absoluteVideoUrl,
    thumbnailUrl: getDefaultOgImageUrl(),
    publisher: { '@id': organizationId },
  });
}

export function eventPortfolioSchema(post: Post): JsonLdObject {
  const slug = getPostSlug(post);
  const imageUrl = getPostHeaderImageUrl(post);
  const description = trimText(stripHtml(post.description), 300) || `${post.title} by ${siteConfig.name}`;

  return compact({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: post.title,
    headline: post.title,
    description,
    url: absoluteUrl(`/events/${slug}`),
    image: imageUrl,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    genre: post.tag?.name || post.tag_name,
    creator: { '@id': organizationId },
    publisher: { '@id': organizationId },
    inLanguage: ['id-ID', 'en-US'],
  });
}

export function equipmentCollectionSchema(equipments: Equipment[]): JsonLdObject {
  return compact({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Event Equipment Rental by eventsclick',
    description: 'Sound system, lighting, truss, multimedia, and event production equipment rental in Indonesia.',
    url: absoluteUrl('/equipments'),
    isPartOf: { '@id': websiteId },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: equipments.slice(0, 50).map((equipment, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: compact({
          '@type': 'Product',
          name: equipment.name,
          description: stripHtml(equipment.description),
          category: equipment.category_name,
          image: equipment.image ? getImageUrl(equipment.image) : undefined,
        }),
      })),
    },
  });
}

export function dynamicPageSchema(page: DynamicPage): JsonLdObject {
  const description = page.meta_description || stripHtml(String(page.content?.description || page.title));

  return webPageSchema({
    name: page.title,
    description: trimText(description, 220),
    path: `/${page.slug}`,
  });
}
