import Hero from '@/components/Hero';
import TrustedBy from '@/components/TrustedBy';
import LatestWorks from '@/components/LatestWorks';
import ProcessSteps from '@/components/ProcessSteps';
import Services from '@/components/Services';
import ExpectationReality from '@/components/ExpectationReality';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';

export default function Home() {
  return (
    <>
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

