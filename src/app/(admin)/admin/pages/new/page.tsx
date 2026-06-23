'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createPage, type TemplateType } from '@/lib/api/dynamic-pages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, Image, FileText, Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

const templates = [
  {
    id: 'promo' as TemplateType,
    name: 'Promo / Campaign',
    description: 'Create promotional pages with hero section, pricing, features, and CTA.',
    icon: Sparkles,
    color: 'bg-purple-100 text-purple-700',
    exampleHref: '/examples/promo',
  },
  {
    id: 'gallery' as TemplateType,
    name: 'Gallery Showcase',
    description: 'Showcase events, portfolios, or projects with image galleries.',
    icon: Image,
    color: 'bg-blue-100 text-blue-700',
    exampleHref: '/examples/gallery',
  },
  {
    id: 'simple' as TemplateType,
    name: 'Editorial Article',
    description: 'Create magazine-style content pages with rich text editor.',
    icon: FileText,
    color: 'bg-green-100 text-green-700',
    exampleHref: '/examples/simple',
  },
];

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    meta_description: '',
  });

  const createMutation = useMutation({
    mutationFn: createPage,
    onSuccess: (data) => {
      toast.success('Page created successfully');
      router.push(`/admin/pages/${data.id}/edit`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSelectTemplate = (templateId: TemplateType) => {
    setSelectedTemplate(templateId);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;

    if (!formData.title || !formData.slug) {
      toast.error('Title and slug are required');
      return;
    }

    // Generate default content based on template
    let content = {};
    switch (selectedTemplate) {
      case 'promo':
        content = {
          heroTitle: formData.title,
          heroSubtitle: '',
          price: '',
          features: [''],
          ctaText: 'Get Started',
          ctaLink: '#',
        };
        break;
      case 'gallery':
        content = {
          title: formData.title,
          description: '',
          images: [],
          eventDate: '',
          venue: '',
          clientName: '',
        };
        break;
      case 'simple':
        content = {
          title: formData.title,
          content: '<p>Start typing your content here...</p>',
        };
        break;
    }

    createMutation.mutate({
      ...formData,
      template_type: selectedTemplate,
      content,
      is_published: false,
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/pages">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create New Page</h1>
          <p className="text-gray-500 mt-1">
            {step === 'template' ? 'Choose a template to get started' : 'Fill in the page details'}
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 ${step === 'template' ? 'text-blue-600' : 'text-gray-500'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'template' ? 'bg-blue-600 text-white' : 'bg-green-500 text-white'}`}>
            {step === 'template' ? '1' : <Check className="w-4 h-4" />}
          </div>
          <span className="font-medium">Select Template</span>
        </div>
        <div className="w-12 h-px bg-gray-200" />
        <div className={`flex items-center gap-2 ${step === 'details' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'details' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span className="font-medium">Page Details</span>
        </div>
      </div>

      {step === 'template' && (
        <div className="grid md:grid-cols-3 gap-6">
          {templates.map((template) => {
            const Icon = template.icon;
            return (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${template.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant={selectedTemplate === template.id ? 'default' : 'outline'}>
                    {selectedTemplate === template.id ? 'Selected' : 'Choose'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-primary"
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Link href={template.exampleHref} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Example
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {step === 'details' && selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Page Details</CardTitle>
            <CardDescription>
              Template: {templates.find(t => t.id === selectedTemplate)?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData({
                        ...formData,
                        title,
                        slug: formData.slug || generateSlug(title),
                      });
                    }}
                    placeholder="e.g., Summer Promotion 2026"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug *</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">/</span>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="summer-promotion-2026"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    This will be the URL of your page
                  </p>
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="Brief description for SEO (optional)"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('template')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create & Edit Page'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
