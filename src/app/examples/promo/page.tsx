import { PromoTemplate } from '@/components/templates';
import { promoExample } from '@/lib/examples/page-examples';

export const metadata = {
  title: 'Promo Template Example | EventsClick',
  description: 'Live example of the Promo / Campaign page template.',
};

export default function PromoExamplePage() {
  return (
    <main className="min-h-screen">
      <PromoTemplate content={promoExample} />
    </main>
  );
}
