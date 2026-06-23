'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import {
  AlertTriangle,
  CheckCircle2,
  FileVideo,
  Image as ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
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

type LoadErrors = Partial<Record<'content' | 'faqs' | 'eventTypes' | 'equipmentTypes', string>>;
type SaveKey =
  | 'landing'
  | 'service'
  | 'design'
  | 'faq'
  | 'eventType'
  | 'equipmentType'
  | `service-delete-${number}`
  | `faq-${number}`
  | `event-type-${number}`
  | `equipment-type-${number}`;

const endpointLabels: Record<keyof LoadErrors, string> = {
  content: 'Site content',
  faqs: 'FAQ',
  eventTypes: 'Event types',
  equipmentTypes: 'Equipment types',
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

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Request failed';
}

function formatFileSize(file: File) {
  const mb = file.size / 1024 / 1024;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(file.size / 1024))} KB`;
}

export default function SiteContentAdminPage() {
  const [elements, setElements] = useState<CustomElement[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [eventTypes, setEventTypes] = useState<BlogTag[]>([]);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadErrors, setLoadErrors] = useState<LoadErrors>({});
  const [savingKey, setSavingKey] = useState<SaveKey | null>(null);

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
  const healthySections = 4 - Object.keys(loadErrors).length;

  async function loadData() {
    setIsLoading(true);
    const [customData, faqData, tagData, equipmentCategoryData] = await Promise.allSettled([
      fetchCustomElements(),
      fetchAdminFaqs(),
      fetchTags(),
      fetchEquipmentCategories(),
    ]);

    const nextErrors: LoadErrors = {};

    if (customData.status === 'fulfilled') {
      setElements(customData.value);

      const heading = findElement(customData.value, 'design_reality', 'heading');
      const description = findElement(customData.value, 'design_reality', 'description');
      if (heading?.content) setDesignHeading(heading.content);
      if (description?.content) setDesignDescription(description.content);
    } else {
      nextErrors.content = getErrorMessage(customData.reason);
    }

    if (faqData.status === 'fulfilled') {
      setFaqs(faqData.value);
    } else {
      nextErrors.faqs = getErrorMessage(faqData.reason);
    }

    if (tagData.status === 'fulfilled') {
      setEventTypes(tagData.value);
    } else {
      nextErrors.eventTypes = getErrorMessage(tagData.reason);
    }

    if (equipmentCategoryData.status === 'fulfilled') {
      setEquipmentTypes(equipmentCategoryData.value);
    } else {
      nextErrors.equipmentTypes = getErrorMessage(equipmentCategoryData.reason);
    }

    setLoadErrors(nextErrors);
    setIsLoading(false);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Some site content failed to load');
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function runSave(key: SaveKey, action: () => Promise<void>, successMessage: string) {
    setSavingKey(key);
    try {
      await action();
      toast.success(successMessage);
      await loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSavingKey(null);
    }
  }

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

    await runSave('landing', async () => {
      if (landingElement) {
        await updateCustomElement(landingElement.id, payload);
      } else {
        await createCustomElement(payload);
      }
      setLandingVideo(null);
    }, 'Landing video saved');
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

    await runSave('service', async () => {
      if (serviceDraft.id) {
        await updateCustomElement(serviceDraft.id, payload);
      } else {
        if (!serviceImage) {
          throw new Error('Service image is required for new service cards');
        }
        await createCustomElement(payload);
      }

      setServiceDraft({ title: '', itemsText: '' });
      setServiceImage(null);
    }, 'Service card saved');
  }

  async function saveDesignReality() {
    await runSave('design', async () => {
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

      setDesignImage(null);
      setRealityImage(null);
    }, 'Design Reality saved');
  }

  async function saveFaq() {
    if (faqs.length >= 7) {
      toast.error('Maximum 7 FAQ items');
      return;
    }

    await runSave('faq', async () => {
      await createFaq(faqDraft);
      setFaqDraft({ question: '', answer: '', display_order: 0 });
    }, 'FAQ added');
  }

  if (isLoading) {
    return <SiteContentSkeleton />;
  }

  return (
    <div className="space-y-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-sky-600">CMS Surface</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Site Content</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Landing video, signature services, FAQ, visual comparison, and redirectable type chips.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill ok={Object.keys(loadErrors).length === 0}>
              {healthySections}/4 sections loaded
            </StatusPill>
            <button className="admin-btn-secondary gap-2" onClick={loadData}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {Object.keys(loadErrors).length > 0 && (
          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="font-bold">Some production endpoints are not available yet.</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {(Object.entries(loadErrors) as Array<[keyof LoadErrors, string]>).map(([key, message]) => (
                    <div key={key} className="rounded-lg bg-white/70 px-3 py-2">
                      <span className="font-semibold">{endpointLabels[key]}:</span> {message}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <Section
        title="Landing Page Video"
        hint="Preferred video: 1920 x 1080, MP4/WebM, under 50MB. Existing placeholder stays live until you upload one."
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <UploadField
            id="landing-video"
            file={landingVideo}
            accept="video/*"
            kind="video"
            currentUrl={landingElement?.link_url}
            onChange={setLandingVideo}
            onClear={() => setLandingVideo(null)}
            isSaving={savingKey === 'landing'}
          />
          <ActionPanel
            title="Hero background"
            description="This updates the video behind the first landing screen."
            actionLabel="Save landing video"
            isSaving={savingKey === 'landing'}
            disabled={!landingVideo}
            onAction={saveLandingVideo}
          />
        </div>
      </Section>

      <Section
        title="Signature Services"
        hint="Preferred card image: 800 x 1000 portrait. Keep titles short and use one bullet per line."
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-950">{serviceDraft.id ? 'Edit service card' : 'New service card'}</h3>
                <p className="text-xs text-slate-500">One line equals one public bullet.</p>
              </div>
              {serviceDraft.id && (
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900"
                  onClick={() => {
                    setServiceDraft({ title: '', itemsText: '' });
                    setServiceImage(null);
                  }}
                  aria-label="Clear service edit"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="space-y-3">
              <input
                className="admin-input"
                placeholder="Service title"
                value={serviceDraft.title}
                onChange={(event) => setServiceDraft((prev) => ({ ...prev, title: event.target.value }))}
              />
              <textarea
                className="admin-input min-h-36"
                placeholder="One service item per line"
                value={serviceDraft.itemsText}
                onChange={(event) => setServiceDraft((prev) => ({ ...prev, itemsText: event.target.value }))}
              />
              <UploadField
                id="service-image"
                file={serviceImage}
                accept="image/*"
                kind="image"
                currentUrl={serviceDraft.imageUrl}
                compact
                onChange={setServiceImage}
                onClear={() => setServiceImage(null)}
                isSaving={savingKey === 'service'}
              />
              <button className="admin-btn w-full gap-2" onClick={saveService} disabled={savingKey === 'service'}>
                {savingKey === 'service' && <Loader2 className="h-4 w-4 animate-spin" />}
                {serviceDraft.id ? 'Update service' : 'Add service'}
              </button>
            </div>
          </div>

          <div className="grid gap-3">
            {services.length === 0 ? (
              <EmptyState title="No service cards yet" description="Add the first signature service to replace the default cards." />
            ) : (
              services.map((service) => (
                <div key={service.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex gap-4">
                    <MediaThumb url={service.imageUrl} alt={service.title} />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-950">{service.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{service.itemsText.split('\n').filter(Boolean).length} items</p>
                      {service.imageUrl && <p className="mt-2 truncate text-xs text-slate-400">{service.imageUrl}</p>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button className="admin-btn-secondary h-9 gap-2 px-3" onClick={() => setServiceDraft(service)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>
                      {service.id && (
                        <button
                          className="admin-btn-danger h-9 gap-2 px-3"
                          disabled={savingKey === `service-delete-${service.id}`}
                          onClick={() => runSave(`service-delete-${service.id}` as SaveKey, async () => {
                            await deleteCustomElement(service.id!);
                          }, 'Service deleted')}
                        >
                          {savingKey === `service-delete-${service.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Section>

      <Section
        title="Design Reality"
        hint="Preferred images: 2070 x 900 or any clean 21:9 image pair. Upload both sides for the best comparison effect."
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <input className="admin-input" value={designHeading} onChange={(event) => setDesignHeading(event.target.value)} />
          <input className="admin-input" value={designDescription} onChange={(event) => setDesignDescription(event.target.value)} />
          <UploadField
            id="design-image"
            file={designImage}
            accept="image/*"
            kind="image"
            currentUrl={designElement?.link_url}
            onChange={setDesignImage}
            onClear={() => setDesignImage(null)}
            isSaving={savingKey === 'design'}
          />
          <UploadField
            id="reality-image"
            file={realityImage}
            accept="image/*"
            kind="image"
            currentUrl={realityElement?.link_url}
            onChange={setRealityImage}
            onClear={() => setRealityImage(null)}
            isSaving={savingKey === 'design'}
          />
        </div>
        <button className="admin-btn mt-4 gap-2" onClick={saveDesignReality} disabled={savingKey === 'design'}>
          {savingKey === 'design' && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Design Reality
        </button>
      </Section>

      <Section title="FAQ" hint="Minimum 3 FAQ items, maximum 7. Public page only shows active FAQ items.">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <input className="admin-input" placeholder="Question" value={faqDraft.question} onChange={(event) => setFaqDraft((prev) => ({ ...prev, question: event.target.value }))} />
            <textarea className="admin-input min-h-28" placeholder="Answer" value={faqDraft.answer} onChange={(event) => setFaqDraft((prev) => ({ ...prev, answer: event.target.value }))} />
            <input className="admin-input" type="number" min={0} placeholder="Display order" value={faqDraft.display_order} onChange={(event) => setFaqDraft((prev) => ({ ...prev, display_order: Number(event.target.value) }))} />
            <button className="admin-btn w-full gap-2" onClick={saveFaq} disabled={savingKey === 'faq' || faqs.length >= 7}>
              {savingKey === 'faq' && <Loader2 className="h-4 w-4 animate-spin" />}
              Add FAQ
            </button>
          </div>
          <div className="space-y-3">
            {faqs.length === 0 ? (
              <EmptyState title="FAQ could not be loaded" description="Check the FAQ endpoint or deploy the backend content migration." />
            ) : (
              faqs.map((faq) => (
                <FaqEditor key={faq.id} faq={faq} canDelete={faqs.length > 3} savingKey={savingKey} runSave={runSave} />
              ))
            )}
          </div>
        </div>
      </Section>

      <Section title="Event Types" hint="Redirect URL is optional. If filled, clicking that event type chip redirects instead of filtering.">
        <TypeDraft
          nameLabel="Event type name"
          slugLabel="Slug"
          draft={eventTypeDraft}
          onChange={setEventTypeDraft}
          onSave={() => runSave('eventType', async () => {
            await createTag(eventTypeDraft);
            setEventTypeDraft({ name: '', slug: '', redirect_url: '' });
          }, 'Event type added')}
          isSaving={savingKey === 'eventType'}
        />
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {eventTypes.length === 0 ? (
            <EmptyState title="Event types unavailable" description="This usually means the backend route /api/blog-tags/get-all is not deployed yet." />
          ) : (
            eventTypes.map((type) => (
              <EventTypeEditor key={type.id} type={type} savingKey={savingKey} runSave={runSave} />
            ))
          )}
        </div>
      </Section>

      <Section title="Equipment Types" hint="Redirect URL is optional. Add as many equipment types as needed.">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <input className="admin-input" placeholder="Equipment type name" value={equipmentTypeDraft.categoryName} onChange={(event) => setEquipmentTypeDraft((prev) => ({ ...prev, categoryName: event.target.value }))} />
          <input className="admin-input" placeholder="Optional redirect URL" value={equipmentTypeDraft.redirect_url} onChange={(event) => setEquipmentTypeDraft((prev) => ({ ...prev, redirect_url: event.target.value }))} />
          <button
            className="admin-btn gap-2"
            disabled={savingKey === 'equipmentType'}
            onClick={() => runSave('equipmentType', async () => {
              await createEquipmentCategory(equipmentTypeDraft);
              setEquipmentTypeDraft({ categoryName: '', redirect_url: '' });
            }, 'Equipment type added')}
          >
            {savingKey === 'equipmentType' && <Loader2 className="h-4 w-4 animate-spin" />}
            Add
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {equipmentTypes.map((type) => (
            <EquipmentTypeEditor key={type.id} type={type} savingKey={savingKey} runSave={runSave} />
          ))}
        </div>
      </Section>
    </div>
  );
}

function Section({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-black tracking-tight text-slate-950">{title}</h2>
        <p className="mt-2 rounded-xl border border-sky-100 bg-sky-50 px-3 py-2 text-sm font-medium text-sky-800">{hint}</p>
      </div>
      {children}
    </section>
  );
}

function StatusPill({ ok, children }: { ok: boolean; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
      {ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
      {children}
    </span>
  );
}

function UploadField({
  id,
  file,
  accept,
  kind,
  currentUrl,
  onChange,
  onClear,
  isSaving,
  compact = false,
}: {
  id: string;
  file: File | null;
  accept: string;
  kind: 'image' | 'video';
  currentUrl?: string | null;
  onChange: (file: File | null) => void;
  onClear: () => void;
  isSaving: boolean;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const icon = kind === 'video' ? <FileVideo className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />;

  return (
    <div className={`rounded-xl border border-dashed ${file ? 'border-sky-300 bg-sky-50/60' : 'border-slate-300 bg-slate-50'} ${compact ? 'p-3' : 'p-4'}`}>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <button
          type="button"
          className="flex min-h-24 flex-1 items-center gap-4 rounded-lg border border-white bg-white px-4 py-3 text-left shadow-sm transition hover:border-sky-200 hover:bg-sky-50"
          onClick={() => inputRef.current?.click()}
        >
          <span className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
          </span>
          <span className="min-w-0">
            <span className="block font-bold text-slate-950">
              {file ? file.name : `Choose ${kind}`}
            </span>
            <span className="mt-1 block text-sm text-slate-500">
              {file ? `${formatFileSize(file)} selected` : currentUrl ? 'Existing media is live' : 'No file selected'}
            </span>
          </span>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-lg bg-white p-3 shadow-sm">
          <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            {icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">
              {file?.name || currentUrl || 'Waiting for upload'}
            </p>
            <p className="text-xs text-slate-400">
              {isSaving ? 'Uploading and saving...' : file ? 'Ready to save' : 'Idle'}
            </p>
          </div>
          {file && (
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              onClick={onClear}
              aria-label="Clear selected file"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {currentUrl && kind === 'image' && (
        <div className="mt-3">
          <img src={getImageUrl(currentUrl)} alt="Current media preview" className="h-24 w-full rounded-lg object-cover" />
        </div>
      )}
    </div>
  );
}

function ActionPanel({
  title,
  description,
  actionLabel,
  isSaving,
  disabled,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel: string;
  isSaving: boolean;
  disabled: boolean;
  onAction: () => void;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      <button className="admin-btn mt-5 gap-2" onClick={onAction} disabled={disabled || isSaving}>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSaving ? 'Saving...' : actionLabel}
      </button>
    </div>
  );
}

function MediaThumb({ url, alt }: { url?: string | null; alt: string }) {
  if (!url) {
    return (
      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
        <ImageIcon className="h-5 w-5" />
      </div>
    );
  }

  return <img src={getImageUrl(url)} alt={alt} className="h-20 w-20 flex-shrink-0 rounded-lg object-cover" />;
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="font-bold text-slate-800">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function SiteContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-44 animate-pulse rounded-2xl bg-slate-200" />
      <div className="h-72 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  );
}

function FaqEditor({
  faq,
  canDelete,
  savingKey,
  runSave,
}: {
  faq: FaqItem;
  canDelete: boolean;
  savingKey: SaveKey | null;
  runSave: (key: SaveKey, action: () => Promise<void>, successMessage: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState(faq);
  const key = `faq-${faq.id}` as const;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <input className="admin-input" value={draft.question} onChange={(event) => setDraft((prev) => ({ ...prev, question: event.target.value }))} />
        <textarea className="admin-input min-h-24" value={draft.answer} onChange={(event) => setDraft((prev) => ({ ...prev, answer: event.target.value }))} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <input className="admin-input max-w-32" type="number" value={draft.display_order} onChange={(event) => setDraft((prev) => ({ ...prev, display_order: Number(event.target.value) }))} />
        <button className="admin-btn gap-2" disabled={savingKey === key} onClick={() => runSave(key, async () => {
          await updateFaq(faq.id, draft);
        }, 'FAQ updated')}>
          {savingKey === key && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
        <button className="admin-btn-secondary" onClick={() => runSave(key, async () => {
          await updateFaq(faq.id, { is_active: !draft.is_active });
        }, 'FAQ visibility updated')}>
          {draft.is_active ? 'Disable' : 'Enable'}
        </button>
        {canDelete && (
          <button className="admin-btn-danger gap-2" onClick={() => runSave(key, async () => {
            await deleteFaq(faq.id);
          }, 'FAQ deleted')}>
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
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
  isSaving,
}: {
  draft: { name: string; slug: string; redirect_url: string };
  onChange: (draft: { name: string; slug: string; redirect_url: string }) => void;
  onSave: () => void;
  nameLabel: string;
  slugLabel: string;
  isSaving: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
      <input className="admin-input" placeholder={nameLabel} value={draft.name} onChange={(event) => onChange({ ...draft, name: event.target.value, slug: draft.slug || slugify(event.target.value) })} />
      <input className="admin-input" placeholder={slugLabel} value={draft.slug} onChange={(event) => onChange({ ...draft, slug: event.target.value })} />
      <input className="admin-input" placeholder="Optional redirect URL" value={draft.redirect_url} onChange={(event) => onChange({ ...draft, redirect_url: event.target.value })} />
      <button className="admin-btn gap-2" onClick={onSave} disabled={isSaving}>
        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
        Add
      </button>
    </div>
  );
}

function EventTypeEditor({
  type,
  savingKey,
  runSave,
}: {
  type: BlogTag;
  savingKey: SaveKey | null;
  runSave: (key: SaveKey, action: () => Promise<void>, successMessage: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ name: type.name, slug: type.slug, redirect_url: type.redirect_url || '' });
  const key = `event-type-${type.id}` as const;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <input className="admin-input" value={draft.name} onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))} />
        <input className="admin-input" value={draft.slug} onChange={(event) => setDraft((prev) => ({ ...prev, slug: event.target.value }))} />
        <input className="admin-input" placeholder="Optional redirect URL" value={draft.redirect_url} onChange={(event) => setDraft((prev) => ({ ...prev, redirect_url: event.target.value }))} />
      </div>
      <div className="mt-3 flex gap-2">
        <button className="admin-btn gap-2" disabled={savingKey === key} onClick={() => runSave(key, async () => {
          await updateTag(type.id, draft);
        }, 'Event type updated')}>
          {savingKey === key && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
        <button className="admin-btn-danger gap-2" onClick={() => runSave(key, async () => {
          await deleteTag(type.id);
        }, 'Event type deleted')}>
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}

function EquipmentTypeEditor({
  type,
  savingKey,
  runSave,
}: {
  type: EquipmentCategory;
  savingKey: SaveKey | null;
  runSave: (key: SaveKey, action: () => Promise<void>, successMessage: string) => Promise<void>;
}) {
  const [draft, setDraft] = useState({ categoryName: type.category_name, redirect_url: type.redirect_url || '' });
  const key = `equipment-type-${type.id}` as const;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-2">
        <input className="admin-input" value={draft.categoryName} onChange={(event) => setDraft((prev) => ({ ...prev, categoryName: event.target.value }))} />
        <input className="admin-input" placeholder="Optional redirect URL" value={draft.redirect_url} onChange={(event) => setDraft((prev) => ({ ...prev, redirect_url: event.target.value }))} />
      </div>
      <div className="mt-3 flex gap-2">
        <button className="admin-btn gap-2" disabled={savingKey === key} onClick={() => runSave(key, async () => {
          await updateEquipmentCategory(type.id, draft);
        }, 'Equipment type updated')}>
          {savingKey === key && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
        <button className="admin-btn-danger gap-2" onClick={() => runSave(key, async () => {
          await deleteEquipmentCategory(type.id);
        }, 'Equipment type deleted')}>
          <Trash2 className="h-4 w-4" />
          Delete
        </button>
      </div>
    </div>
  );
}
