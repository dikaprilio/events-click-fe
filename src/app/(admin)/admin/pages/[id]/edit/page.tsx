'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getPageById, updatePage, publishPage, type TemplateType } from '@/lib/api/dynamic-pages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SingleImageUpload } from '@/components/admin/SingleImageUpload';
import { MultiImageUpload } from '@/components/admin/MultiImageUpload';
import {
  ArrowLeft,
  Save,
  Globe,
  Monitor,
  Smartphone,
  Sparkles,
  Image,
  FileText,
  Plus,
  X,
  GripVertical,
  Layout,
  Eye,
  ChevronLeft,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import TipTapEditor from '@/components/ui/TipTapEditor';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { PromoTemplate, GalleryTemplate, SimpleTemplate } from '@/components/templates';

const templateIcons: Record<string, typeof FileText> = {
  promo: Sparkles,
  gallery: Image,
  simple: FileText,
};

const templateNames: Record<string, string> = {
  promo: 'Promo / Campaign',
  gallery: 'Gallery Showcase',
  simple: 'Editorial Article',
};

// ==================== SECTION COMPONENT ====================
function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <div
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-100">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== PROMO BUILDER ====================
function PromoBuilder({
  pageId,
  content,
  onChange,
}: {
  pageId: number;
  content: any;
  onChange: (c: any) => void;
}) {
  const update = (field: string, value: any) => onChange({ ...content, [field]: value });

  return (
    <div className="space-y-5">
      <Section title="Hero Section" icon={Sparkles}>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Hero Image</Label>
            <div className="mt-1.5">
              <SingleImageUpload
                pageId={pageId}
                imageUrl={content.heroImage}
                onUpload={(url) => update('heroImage', url)}
                onDelete={() => update('heroImage', undefined)}
                aspectRatio={4 / 3}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Headline</Label>
            <Input
              value={content.heroTitle || ''}
              onChange={(e) => update('heroTitle', e.target.value)}
              placeholder="Enter headline..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Badge / Subtitle</Label>
            <Input
              value={content.badge || content.heroSubtitle || ''}
              onChange={(e) => update('badge', e.target.value)}
              placeholder="e.g. Limited Time Offer"
              className="mt-1.5"
            />
          </div>
        </div>
      </Section>

      <Section title="Pricing" icon={Layout}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Current Price</Label>
            <Input
              value={content.price || ''}
              onChange={(e) => update('price', e.target.value)}
              placeholder="e.g. Rp 45.000.000"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Original Price (optional)</Label>
            <Input
              value={content.originalPrice || ''}
              onChange={(e) => update('originalPrice', e.target.value)}
              placeholder="e.g. Rp 65.000.000"
              className="mt-1.5"
            />
          </div>
        </div>
      </Section>

      <Section title="What's Included" icon={Check}>
        <div className="space-y-3">
          <AnimatePresence>
            {(content.features || []).map((feature: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-2"
              >
                <div className="p-2 bg-gray-100 rounded-lg cursor-move">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  value={feature}
                  onChange={(e) => {
                    const next = [...(content.features || [])];
                    next[index] = e.target.value;
                    update('features', next);
                  }}
                  placeholder="Feature description..."
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const next = [...(content.features || [])];
                    next.splice(index, 1);
                    update('features', next);
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => update('features', [...(content.features || []), ''])}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Feature
          </Button>
        </div>
      </Section>

      <Section title="Package Details" icon={FileText}>
        <TipTapEditor
          content={content.description || ''}
          onChange={(html) => update('description', html)}
          placeholder="Enter package details, terms, or additional information..."
        />
      </Section>

      <Section title="Call to Action" icon={Layout}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Button Text</Label>
            <Input
              value={content.ctaText || ''}
              onChange={(e) => update('ctaText', e.target.value)}
              placeholder="e.g. Book Now"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Button Link</Label>
            <Input
              value={content.ctaLink || ''}
              onChange={(e) => update('ctaLink', e.target.value)}
              placeholder="e.g. /contact"
              className="mt-1.5"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

// ==================== GALLERY BUILDER ====================
function GalleryBuilder({
  pageId,
  content,
  onChange,
}: {
  pageId: number;
  content: any;
  onChange: (c: any) => void;
}) {
  const update = (field: string, value: any) => onChange({ ...content, [field]: value });

  return (
    <div className="space-y-5">
      <Section title="Project Info" icon={Image}>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Gallery Title</Label>
            <Input
              value={content.title || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Enter gallery title..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Subtitle</Label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => update('subtitle', e.target.value)}
              placeholder="Enter subtitle or tagline..."
              className="mt-1.5"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Event Date</Label>
              <Input
                type="date"
                value={content.eventDate || ''}
                onChange={(e) => update('eventDate', e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Venue</Label>
              <Input
                value={content.venue || ''}
                onChange={(e) => update('venue', e.target.value)}
                placeholder="Venue"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600">Client</Label>
              <Input
                value={content.client || ''}
                onChange={(e) => update('client', e.target.value)}
                placeholder="Client"
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Description" icon={FileText}>
        <TipTapEditor
          content={content.description || ''}
          onChange={(html) => update('description', html)}
          placeholder="Describe the project, event, or gallery..."
        />
      </Section>

      <Section title="Photo Gallery" icon={Image}>
        <MultiImageUpload
          pageId={pageId}
          images={content.images || []}
          onChange={(images) => update('images', images)}
        />
      </Section>
    </div>
  );
}

// ==================== SIMPLE BUILDER ====================
function SimpleBuilder({
  pageId,
  content,
  onChange,
}: {
  pageId: number;
  content: any;
  onChange: (c: any) => void;
}) {
  const update = (field: string, value: any) => onChange({ ...content, [field]: value });

  return (
    <div className="space-y-5">
      <Section title="Article Header" icon={FileText}>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Page Title</Label>
            <Input
              value={content.title || ''}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Enter page title..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Subtitle (optional)</Label>
            <Input
              value={content.subtitle || ''}
              onChange={(e) => update('subtitle', e.target.value)}
              placeholder="Enter subtitle..."
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Hero Image (optional)</Label>
            <div className="mt-1.5">
              <SingleImageUpload
                pageId={pageId}
                imageUrl={content.heroImage}
                onUpload={(url) => update('heroImage', url)}
                onDelete={() => update('heroImage', undefined)}
                aspectRatio={21 / 9}
              />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Page Content" icon={FileText}>
        <TipTapEditor
          content={content.content || ''}
          onChange={(html) => update('content', html)}
          placeholder="Start writing your content here..."
        />
      </Section>

      <Section title="SEO & Meta" icon={Layout}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm text-gray-600">Author</Label>
            <Input
              value={content.author || ''}
              onChange={(e) => update('author', e.target.value)}
              placeholder="Author name"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">Read Time</Label>
            <Input
              value={content.readTime || ''}
              onChange={(e) => update('readTime', e.target.value)}
              placeholder="e.g. 5 min"
              className="mt-1.5"
            />
          </div>
        </div>
      </Section>
    </div>
  );
}

// ==================== MAIN PAGE ====================
export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const pageId = Number(params.id);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [showPreviewOnMobile, setShowPreviewOnMobile] = useState(false);

  const { data: page, isLoading } = useQuery({
    queryKey: ['dynamic-page', pageId],
    queryFn: () => getPageById(pageId),
    enabled: !!pageId,
  });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_description: '',
    content: {} as any,
    is_published: false,
  });

  useEffect(() => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        meta_description: page.meta_description || '',
        content: page.content,
        is_published: page.is_published,
      });
    }
  }, [page]);

  const updateMutation = useMutation({
    mutationFn: () => updatePage(pageId, formData),
    onSuccess: () => {
      toast.success('Page saved successfully');
      queryClient.invalidateQueries({ queryKey: ['dynamic-page', pageId] });
      queryClient.invalidateQueries({ queryKey: ['dynamic-pages'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const publishMutation = useMutation({
    mutationFn: (published: boolean) => publishPage(pageId, published),
    onSuccess: () => {
      toast.success(formData.is_published ? 'Page unpublished' : 'Page published!');
      setFormData({ ...formData, is_published: !formData.is_published });
      queryClient.invalidateQueries({ queryKey: ['dynamic-page', pageId] });
      queryClient.invalidateQueries({ queryKey: ['dynamic-pages'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleContentChange = (content: any) => {
    setFormData({ ...formData, content });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!page) {
    return <div className="p-8 text-center text-red-500">Page not found</div>;
  }

  const Icon = templateIcons[page.template_type] || FileText;

  const builderPanel = (
    <div className="space-y-5 pb-20">
      {/* Page Settings */}
      <Section title="Page Settings" icon={Layout} defaultOpen>
        <div className="space-y-4">
          <div>
            <Label className="text-sm text-gray-600">Page Title</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label className="text-sm text-gray-600">URL Slug</Label>
            <div className="flex items-center mt-1.5">
              <span className="text-gray-400 text-sm mr-2">/</span>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="text-sm text-gray-600">Meta Description</Label>
            <Input
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="SEO description..."
              className="mt-1.5"
            />
          </div>
        </div>
      </Section>

      {/* Template Builder */}
      {page.template_type === 'promo' && (
        <PromoBuilder pageId={pageId} content={formData.content} onChange={handleContentChange} />
      )}
      {page.template_type === 'gallery' && (
        <GalleryBuilder pageId={pageId} content={formData.content} onChange={handleContentChange} />
      )}
      {page.template_type === 'simple' && (
        <SimpleBuilder pageId={pageId} content={formData.content} onChange={handleContentChange} />
      )}
    </div>
  );

  const previewPanel = (
    <div
      className={`mx-auto bg-white shadow-2xl transition-all duration-300 ${
        previewDevice === 'mobile' ? 'max-w-md' : 'w-full'
      }`}
    >
      <div className="min-h-[600px]">
        {page.template_type === 'promo' && <PromoTemplate content={formData.content} />}
        {page.template_type === 'gallery' && <GalleryTemplate content={formData.content} />}
        {page.template_type === 'simple' && <SimpleTemplate content={formData.content} />}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/pages">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl md:text-2xl font-bold">{formData.title || 'Edit Page'}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.is_published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {formData.is_published ? 'Published' : 'Draft'}
              </span>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-0.5">
              <Icon className="w-4 h-4" />
              {templateNames[page.template_type]}
              <span className="text-gray-300">/</span>
              <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{formData.slug}</code>
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {/* Device Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mr-4">
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                previewDevice === 'desktop'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Desktop
            </button>
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                previewDevice === 'mobile'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              Mobile
            </button>
          </div>

          <Button
            variant={formData.is_published ? 'outline' : 'default'}
            onClick={() => publishMutation.mutate(!formData.is_published)}
            disabled={publishMutation.isPending}
            size="sm"
          >
            <Globe className="w-4 h-4 mr-2" />
            {formData.is_published ? 'Unpublish' : 'Publish'}
          </Button>

          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
            size="sm"
          >
            {updateMutation.isPending ? (
              <LoaderIcon />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      {/* Mobile Action Bar */}
      <div className="md:hidden flex items-center justify-between pb-3 mb-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreviewOnMobile(!showPreviewOnMobile)}
          className="flex-1 mr-2"
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreviewOnMobile ? 'Edit Page' : 'Preview'}
        </Button>
        <Button
          onClick={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
          size="sm"
          className="flex-1"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-0 md:gap-6">
        {/* Builder Panel */}
        <div
          className={`${
            showPreviewOnMobile ? 'hidden md:block' : 'block'
          } md:w-1/2 lg:w-5/12 xl:w-1/3`}
        >
          {builderPanel}
        </div>

        {/* Preview Panel */}
        <div
          className={`${
            showPreviewOnMobile ? 'block' : 'hidden md:block'
          } md:flex-1 md:sticky md:top-24 md:self-start`}
        >
          <div className="bg-gray-100/50 border border-gray-200 rounded-xl p-4 md:p-6">
            {/* Mobile device toggle inside preview */}
            <div className="md:hidden flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  previewDevice === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  previewDevice === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
            {previewPanel}
          </div>
        </div>
      </div>
    </div>
  );
}

function LoaderIcon() {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <circle
        className="opacity-75"
        cx="12"
        cy="12"
        r="10"
        fill="currentColor"
      />
    </svg>
  );
}
