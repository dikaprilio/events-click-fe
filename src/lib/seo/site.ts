export const siteConfig = {
  name: 'eventsclick',
  legalName: 'PT Majelis Inovatif Kreasi Bangsa',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://eventsclick.id',
  defaultTitle: 'eventsclick | Event Organizer Indonesia',
  titleTemplate: '%s | eventsclick',
  description:
    'Event organizer Indonesia berbasis Semarang untuk corporate events, MICE, brand activation, exhibition, equipment rental, dan creative event production.',
  locale: 'id_ID',
  alternateLocale: 'en_US',
  language: 'id',
  keywords: [
    'event organizer indonesia',
    'event organizer semarang',
    'event production',
    'corporate events',
    'brand activation',
    'MICE',
    'equipment rental',
    'sound system rental',
    'lighting rental',
    'exhibition',
  ],
  ogImage: '/blue-bg-white-text-logo.png',
  logo: '/white-logo-no-bg.png',
  contact: {
    phone: '+62 851-5649-8485',
    whatsapp: '6285156498485',
    email: '',
  },
  addresses: [
    {
      name: 'Semarang Office',
      streetAddress: 'Jl. Imam Soeparto No 9 Tembalang',
      addressLocality: 'Semarang',
      addressRegion: 'Jawa Tengah',
      addressCountry: 'ID',
    },
    {
      name: 'Workshop',
      streetAddress: 'Jl. Majapahit No 221 Pedurungan',
      addressLocality: 'Semarang',
      addressRegion: 'Jawa Tengah',
      addressCountry: 'ID',
    },
  ],
  socialLinks: [] as string[],
};

export const indexedStaticRoutes = [
  '/',
  '/about',
  '/contact',
  '/commitment',
  '/events',
  '/equipments',
] as const;
