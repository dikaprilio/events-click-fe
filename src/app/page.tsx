import Hero from '@/components/Hero';
import TrustedBy from '@/components/TrustedBy';
import LatestWorks from '@/components/LatestWorks';
import ProcessSteps from '@/components/ProcessSteps';
import Services from '@/components/Services';
import ExpectationReality from '@/components/ExpectationReality';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import JsonLd from '@/components/JsonLd';
import { faqs as fallbackFaqs } from '@/data/faq';
import { getFaqs } from '@/lib/api/faqs';
import { getCustomElementsBySection } from '@/lib/api/custom-elements';
import { faqPageSchema, localBusinessSchema, organizationSchema, videoObjectSchema, websiteSchema } from '@/lib/seo/schema';
import { findElement } from '@/types/custom-element';
import { getImageUrl } from '@/lib/utils';

async function getHomeSchemas() {
  const [faqResult, landingResult] = await Promise.allSettled([
    getFaqs({ next: { revalidate: 300 } }),
    getCustomElementsBySection('landing', { next: { revalidate: 300 } }),
  ]);

  const faqItems = faqResult.status === 'fulfilled' && faqResult.value.length >= 3
    ? faqResult.value
    : fallbackFaqs.map((faq, index) => ({
      id: index + 1,
      question: faq.question,
      answer: faq.answer,
      display_order: index + 1,
    }));

  const landingElements = landingResult.status === 'fulfilled' ? landingResult.value : [];
  const heroVideo = findElement(landingElements, 'hero_video');
  const videoUrl = heroVideo?.link_url ? getImageUrl(heroVideo.link_url) : '/stock-footage.mp4';

  return [
    organizationSchema(),
    localBusinessSchema(),
    websiteSchema(),
    faqPageSchema(faqItems),
    videoObjectSchema(videoUrl),
  ].filter((schema): schema is Record<string, unknown> => Boolean(schema));
}

export default async function Home() {
  const schemas = await getHomeSchemas();

  return (
    <>
      <JsonLd data={schemas} />
      <Hero />
      <TrustedBy />
      <LatestWorks />
      <ProcessSteps />
      <Services />
      <ExpectationReality />
      <FAQ />
      <CTA />
    </>
  );
}

