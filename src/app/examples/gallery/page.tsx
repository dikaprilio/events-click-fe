import { GalleryTemplate } from '@/components/templates';
import { galleryExample } from '@/lib/examples/page-examples';

export const metadata = {
  title: 'Gallery Template Example | EventsClick',
  description: 'Live example of the Gallery Showcase page template.',
};

export default function GalleryExamplePage() {
  return (
    <main className="min-h-screen">
      <GalleryTemplate content={galleryExample} />
    </main>
  );
}
