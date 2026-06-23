import EquipmentsClient from '@/components/EquipmentsClient';
import JsonLd from '@/components/JsonLd';
import { getAllEquipments } from '@/lib/api/equipments';
import { breadcrumbSchema, equipmentCollectionSchema, webPageSchema } from '@/lib/seo/schema';
import { absoluteUrl } from '@/lib/seo/url';

export const metadata = {
  title: "Event Equipment Rental Indonesia",
  description: "Sewa equipment event untuk sound system, lighting, truss, multimedia, stage, dan kebutuhan produksi event di Indonesia.",
  alternates: {
    canonical: absoluteUrl('/equipments'),
  },
  openGraph: {
    title: "Event Equipment Rental Indonesia | eventsclick",
    description: "Katalog equipment event untuk sound system, lighting, truss, multimedia, dan produksi event.",
    url: absoluteUrl('/equipments'),
  },
};

async function getEquipmentSchemas() {
  try {
    const equipments = await getAllEquipments({ limit: 100 }, { next: { revalidate: 300 } });
    return [
      equipmentCollectionSchema(equipments),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Equipments', path: '/equipments' },
      ]),
    ];
  } catch {
    return [
      webPageSchema({
        type: 'CollectionPage',
        name: 'Event Equipment Rental Indonesia',
        description: metadata.description,
        path: '/equipments',
      }),
      breadcrumbSchema([
        { name: 'Home', path: '/' },
        { name: 'Equipments', path: '/equipments' },
      ]),
    ];
  }
}

export default async function EquipmentsPage() {
  const schemas = await getEquipmentSchemas();

  return (
    <>
      <JsonLd data={schemas} />
      <EquipmentsClient />
    </>
  );
}
