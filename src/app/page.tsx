import Hero from '@/components/Hero';
import TrustedBy from '@/components/TrustedBy';
import LatestWorks from '@/components/LatestWorks';
import Services from '@/components/Services';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <LatestWorks />
      <Services />
      <FAQ />
      <CTA />
    </>
  );
}
