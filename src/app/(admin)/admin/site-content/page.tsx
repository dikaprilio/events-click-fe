'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import {
  createCustomElement,
  deleteCustomElement,
  fetchCustomElements,
  updateCustomElement,
} from '@/lib/api/custom-elements';
import { CustomElement } from '@/types/custom-element';
import { getImageUrl } from '@/lib/utils';
import {
  createFaq,
  deleteFaq,
  FaqItem,
  fetchAdminFaqs,
  updateFaq,
} from '@/lib/api/faqs';
import {
  BlogTag,
  createTag,
  deleteTag,
  fetchTags,
  updateTag,
} from '@/lib/api/tags';
import {
  createEquipmentCategory,
  deleteEquipmentCategory,
  fetchEquipmentCategories,
  updateEquipmentCategory,
} from '@/lib/api/equipments';
import { EquipmentCategory } from '@/types/equipment';

type ServiceCard = {
  id?: number;
  title: string;
  itemsText: string;
  imageUrl?: string | null;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseService(element: CustomElement): ServiceCard {
  try {
    const data = JSON.parse(element.content || '{}') as { title?: string; items?: string[] };
    return {
      id: element.id,
      title: data.title || element.element_name,
      itemsText: Array.isArray(data.items) ? data.items.join('\n') : '',
      imageUrl: element.link_url,
    };
  } catch {
    return {
      id: element.id,
      title: element.element_name,
      itemsText: '',
      imageUrl: element.link_url,
    };
  }
}

function findElement(elements: CustomElement[], section: string, name: string) {
  return elements.find((element) => element.section === section && element.element_name === name);
}

export default function SiteContentAdminPage() {
  const [elements, setElements] = useState<CustomElement[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [eventTypes, setEventTypes] = useState<BlogTag[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [landingVideo, setLandingVideo] = useState<File | null>(null);
  const [serviceDraft, setServiceDraft] = useState<ServiceCard>({ title: '', itemsText: '' });
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [designImage, setDesignImage] = useState<File | null>(null);
  const [realityImage, setRealityImage] = useState<File | null>(null);
  const [designHeading, setDesignHeading] = useState('Magic Happens With');
  const [designDescription, setDesignDescription] = useState('Feel the magic, embrace the vibe. With eventsclick Production, Your event is alive, even before it starts.');
  const [faqDraft, setFaqDraft] = useState({ question: '', answer: '', display_order: 0 });
  const [eventTypeDraft, setEventTypeDraft] = useState({ name: '', slug: '', redirect_url: '' });
  const [equipmentTypeDraft, setEquipmentTypeDraft] = useState({ categoryName: '', redirect_url: '' });

  const landingElement = useMemo(
    () => findElement(elements, 'landing', 'hero_video'),
    [elements]
  );
  const services = useMemo(
    () => elements.filter((element) => element.section === 'signature_services').map(parseService),
    [elements]
  );
  const designElement = useMemo(
    () => findElement(elements, 'design_reality', 'design_image'),
    [elements]
  );
  const realityElement = useMemo(
    () => findElement(elements, 'design_reality', 'reality_image'),
    [elements]
  );

  async function loadData() {
    setIsLoading(true);
    try {
      const [customData, faqData, tagData, equipmentCategoryData] = await Promise.all([
        fetchCustomElements(),
        fetchAdminFaqs(),
        fetchTags(),
        fetchEquipmentCategories(),
      ]);
      setElements(customData);
      setFaqs(faqData);
      setEventTypes(tagData);
      setEquipmentTypes(equipmentCategoryData);

      const heading = findElement(customData, 'design_reality', 'heading');
      const description = findElement(customData, 'design_reality', 'description');
      if (heading?.content) setDesignHeading(heading.content);
      if (description?.content) setDesignDescription(description.content);
    } catch {
      toast.error('Failed to load site content');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function saveLandingVideo() {
    if (!landingVideo) {
      toast.error('Choose a video first');
      return;
    }

    const payload = {
      element_name: 'hero_video',
      section: 'landing',
      element_type: 'video',
      content: 'Landing page background video',
      element_file: landingVideo,
    };

    if (landingElement) {
      await updateCustomElement(landingElement.id, payload);
    } else {
      await createCustomElement(payload);
    }

    toast.success('Landing video saved');
    setLandingVideo(null);
    await loadData();
  }

  async function saveService() {
    if (!serviceDraft.title.trim() || !serviceDraft.itemsText.trim()) {
      toast.error('Service title and items are required');
      return;
    }

    const content = JSON.stringify({
      title: serviceDraft.title.trim(),
      items: serviceDraft.itemsText.split('\n').map((item) => item.trim()).filter(Boolean),
    });

    const payload = {
      element_name: slugify(serviceDraft.title) || `service_${Date.now()}`,
      section: 'signature_services',
      element_type: 'image',
      content,
      element_file: serviceImage,
    };

    if (serviceDraft.id) {
      await updateCustomElement(serviceDraft.id, payload);
    } else {
      if (!serviceImage) {
        toast.error('Service image is required for new service cards');
        return;
      }
      await createCustomElement(payload);
    }

    toast.success('Service card saved');
    setServiceDraft({ title: '', itemsText: '' });
    setServiceImage(null);
    await loadData();
  }

  async function saveDesignReality() {
    const headingElement = findElement(elements, 'design_reality', 'heading');
    const descriptionElement = findElement(elements, 'design_reality', 'description');

    if (headingElement) {
      await updateCustomElement(headingElement.id, { content: designHeading });
    } else {
      await createCustomElement({
        element_name: 'heading',
        section: 'design_reality',
        element_type: 'text',
        content: designHeading,
      });
    }

    if (descriptionElement) {
      await updateCustomElement(descriptionElement.id, { content: designDescription });
    } else {
      await createCustomElement({
        element_name: 'description',
        section: 'design_reality',
        element_type: 'text',
        content: designDescription,
      });
    }

    if (designImage) {
      const payload = {
        element_name: 'design_image',
        section: 'design_reality',
        element_type: 'image',
        content: 'Design comparison image',
        element_file: designImage,
      };
      if (designElement) await updateCustomElement(designElement.id, payload);
      else await createCustomElement(payload);
    }

    if (realityImage) {
      const payload = {
        element_name: 'reality_image',
        section: 'design_reality',
        element_type: 'image',
        content: 'Reality comparison image',
        element_file: realityImage,
      };
      if (realityElement) await updateCustomElement(realityElement.id, payload);
      else await createCustomElement(payload);
    }

    toast.success('Design Reality saved');
    setDesignImage(null);
    setRealityImage(null);
    await loadData();
  }

  async function saveFaq() {
    if (faqs.length >= 7) {
      toast.error('Maximum 7 FAQ items');
      return;
    }
    await createFaq(faqDraft);
    toast.success('FAQ added');
    setFaqDraft({ question: '', answer: '', display_order: 0 });
    await loadData();
  }

  if (isLoading) {
    return <div className="text-gray-600">Loading site content...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Site Content</h1>
        <p className="text-gray-500 mt-2">Manage editable landing sections, FAQ, and type redirects.</p>
      </div>

      <Section title="Landing Page Video" hint="Preferred video: 1920 x 1080, MP4/WebM, under 50MB. Existing placeholder stays live until you upload one.">
        {landingElement?.link_url && (
          <p className="text-sm text-gray-600 mb-3">Current: {landingElement.link_url}</p>
        )}
        <input type="file" accept="video/*" onChange={(event) => setLandingVideo(event.target.files?.[0] || null)} />
        <button className="admin-btn mt-4" onClick={saveLandingVideo}>Save landing video</button>
      </Section>

      <Section title="Signature Services" hint="Preferred card image: 800 x 1000 portrait. Keep titles short and use one bullet per line.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <input
              className="admin-input"
              placeholder="Service title"
              value={serviceDraft.title}
              onChange={(event) => setServiceDraft((prev) => ({ ...prev, title: event.target.value }))}
            />
            <textarea
              className="admin-input min-h-32"
              placeholder="One service item per line"
              value={serviceDraft.itemsText}
              onChange={(event) => setServiceDraft((prev) => ({ ...prev, itemsText: event.target.value }))}
            />
            <input type="file" accept="image/*" onChange={(event) => setServiceImage(event.target.files?.[0] || null)} />
            <button className="admin-btn" onClick={saveService}>{serviceDraft.id ? 'Update service' : 'Add service'}</button>
          </div>
          <div className="space-y-3">
            {services.map((service) => (
              <div key={service.id} className="rounded-lg border border-gray-200 p-4">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{service.title}</p>
                    <p className="text-sm text-gray-500">{service.itemsText.split('\n').filter(Boolean).length} items</p>
                    {service.imageUrl && <p className="text-xs text-gray-400 mt-1">{service.imageUrl}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button className="text-sm text-indigo-600" onClick={() => setServiceDraft(service)}>Edit</button>
                    {service.id && (
                      <button className="text-sm text-red-600" onClick={async () => {
                        await deleteCustomElement(service.id!);
                        toast.success('Service deleted');
                        await loadData();
                      }}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="Design Reality" hint="Preferred images: 2070 x 900 or any clean 21:9 image pair. Upload both sides for the best comparison effect.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <input className="admin-input" value={designHeading} onChange={(event) => setDesignHeading(event.target.value)} />
          <input className="admin-input" value={designDescription} onChange={(event) => setDesignDescription(event.target.value)} />
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Design image</p>
            {designElement?.link_url && <img src={getImageUrl(designElement.link_url)} alt="Design preview" className="h-24 rounded object-cover mb-2" />}
            <input type="file" accept="image/*" onChange={(event) => setDesignImage(event.target.files?.[0] || null)} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Reality image</p>
            {realityElement?.link_url && <img src={getImageUrl(realityElement.link_url)} alt="Reality preview" className="h-24 rounded object-cover mb-2" />}
            <input type="file" accept="image/*" onChange={(event) => setRealityImage(event.target.files?.[0] || null)} />
          </div>
        </div>
        <button className="admin-btn mt-4" onClick={saveDesignReality}>Save Design Reality</button>
      </Section>

      <Section title="FAQ" hint="Minimum 3 FAQ items, maximum 7. Public page only shows active FAQ items.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <input className="admin-input" placeholder="Question" value={faqDraft.question} onChange={(event) => setFaqDraft((prev) => ({ ...prev, question: event.target.value }))} />
            <textarea className="admin-input min-h-28" placeholder="Answer" value={faqDraft.answer} onChange={(event) => setFaqDraft((prev) => ({ ...prev, answer: event.target.value }))} />
            <input className="admin-input" type="number" min={0} placeholder="Display order" value={faqDraft.display_order} onChange={(event) => setFaqDraft((prev) => ({ ...prev, display_order: Number(event.target.value) }))} />
            <button className="admin-btn" onClick={saveFaq}>Add FAQ</button>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FaqEditor key={faq.id} faq={faq} canDelete={faqs.length > 3} onReload={loadData} />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Event Types" hint="Redirect URL is optional. If filled, clicking that event type chip redirects instead of filtering.">
        <TypeDraft
          nameLabel="Event type name"
          slugLabel="Slug"
          draft={eventTypeDraft}
          onChange={setEventTypeDraft}
          onSave={async () => {
            await createTag(eventTypeDraft);
            toast.success('Event type added');
            setEventTypeDraft({ name: '', slug: '', redirect_url: '' });
            await loadData();
          }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
          {eventTypes.map((type) => (
            <EventTypeEditor key={type.id} type={type} onReload={loadData} />
          ))}
        </div>
      </Section>

      <Section title="Equipment Types" hint="Redirect URL is optional. Add as many equipment types as needed.">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_auto] gap-3">
          <input className="admin-input" placeholder="Equipment type name" value={equipmentTypeDraft.categoryName} onChange={(event) => setEquipmentTypeDraft((prev) => ({ ...prev, categoryName: event.target.value }))} />
          <input className="admin-input" placeholder="Optional redirect URL" value={equipmentTypeDraft.redirect_url} onChange={(event) => setEquipmentTypeDraft((prev) => ({ ...prev, redirect_url: event.target.value }))} />
          <button className="admin-btn" onClick={async () => {
            await createEquipmentCategory(equipmentTypeDraft);
            toast.success('Equipment type added');
            setEquipmentTypeDraft({ categoryName: '', redirect_url: '' });
            await loadData();
          }}>Add</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-4">
          {equipmentTypes.map((type) => (
            <EquipmentTypeEditor key={type.id} type={type} onReload={loadData} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-md px-3 py-2 mt-2">{hint}</p>
      </div>
      {children}
    </section>
  );
}

function FaqEditor({ faq, canDelete, onReload }: { faq: FaqItem; canDelete: boolean; onReload: () => Promise<void> }) {
  const [draft, setDraft] = useState(faq);

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-2">
      <input className="admin-input" value={draft.question} onChange={(event) => setDraft((prev) => ({ ...prev, question: event.target.value }))} />
      <textarea className="admin-input min-h-24" value={draft.answer} onChange={(event) => setDraft((prev) => ({ ...prev, answer: event.target.value }))} />
      <div className="flex flex-wrap gap-2">
        <input className="admin-input max-w-32" type="number" value={draft.display_order} onChange={(event) => setDraft((prev) => ({ ...prev, display_order: Number(event.target.value) }))} />
        <button className="admin-btn" onClick={async () => {
          await updateFaq(faq.id, draft);
          toast.success('FAQ updated');
          await onReload();
        }}>Save</button>
        <button className="admin-btn-secondary" onClick={async () => {
          await updateFaq(faq.id, { is_active: !draft.is_active });
          toast.success('FAQ visibility updated');
          await onReload();
        }}>{draft.is_active ? 'Disable' : 'Enable'}</button>
        {canDelete && (
          <button className="admin-btn-danger" onClick={async () => {
            await deleteFaq(faq.id);
            toast.success('FAQ deleted');
            await onReload();
          }}>Delete</button>
        )}
      </div>
    </div>
  );
}

function TypeDraft({
  draft,
  onChange,
  onSave,
  nameLabel,
  slugLabel,
}: {
  draft: { name: string; slug: string; redirect_url: string };
  onChange: (draft: { name: string; slug: string; redirect_url: string }) => void;
  onSave: () => Promise<void>;
  nameLabel: string;
  slugLabel: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_auto] gap-3">
      <input className="admin-input" placeholder={nameLabel} value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value, slug: draft.slug || slugify(event.target.value) })} />
      <input className="admin-input" placeholder={slugLabel} value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} />
      <input className="admin-input" placeholder="Optional redirect URL" value={draft.redirect_url} onChange={(event) => onChange({ ...draft, redirect_url: event.target.value })} />
      <button className="admin-btn" onClick={onSave}>Add</button>
    </div>
  );
}

function EventTypeEditor({ type, onReload }: { type: BlogTag; onReload: () => Promise<void> }) {
  const [draft, setDraft] = useState({ name: type.name, slug: type.slug, redirect_url: type.redirect_url || '' });

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-2">
      <input className="admin-input" value={draft.name} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} />
      <input className="admin-input" value={draft.slug} onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))} />
      <input className="admin-input" placeholder="Optional redirect URL" value={draft.redirect_url} onChange={(event) => setDraft((prev) => ({ ...prev, redirect_url: event.target.value }))} />
      <div className="flex gap-2">
        <button className="admin-btn" onClick={async () => {
          await updateTag(type.id, draft);
          toast.success('Event type updated');
          await onReload();
        }}>Save</button>
        <button className="admin-btn-danger" onClick={async () => {
          await deleteTag(type.id);
          toast.success('Event type deleted');
          await onReload();
        }}>Delete</button>
      </div>
    </div>
  );
}

function EquipmentTypeEditor({ type, onReload }: { type: EquipmentCategory; onReload: () => Promise<void> }) {
  const [draft, setDraft] = useState({ categoryName: type.category_name, redirect_url: type.redirect_url || '' });

  return (
    <div className="rounded-lg border border-gray-200 p-4 space-y-2">
      <input className="admin-input" value={draft.categoryName} onChange={(event) => setDraft((prev) => ({ ...prev, categoryName: event.target.value }))} />
      <input className="admin-input" placeholder="Optional redirect URL" value={draft.redirect_url} onChange={(event) => setDraft((prev) => ({ ...prev, redirect_url: event.target.value }))} />
      <div className="flex gap-2">
        <button className="admin-btn" onClick={async () => {
          await updateEquipmentCategory(type.id, draft);
          toast.success('Equipment type updated');
          await onReload();
        }}>Save</button>
        <button className="admin-btn-danger" onClick={async () => {
          await deleteEquipmentCategory(type.id);
          toast.success('Equipment type deleted');
          await onReload();
        }}>Delete</button>
      </div>
    </div>
  );
}
