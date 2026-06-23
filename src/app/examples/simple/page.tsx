import { SimpleTemplate } from '@/components/templates';
import { simpleExample } from '@/lib/examples/page-examples';

export const metadata = {
  title: 'Simple Template Example | EventsClick',
  description: 'Live example of the Editorial Article page template.',
};

export default function SimpleExamplePage() {
  return (
    <main className="min-h-screen">
      <SimpleTemplate content={simpleExample} />
    </main>
  );
}
