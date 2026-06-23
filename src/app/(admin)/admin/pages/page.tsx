'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import { getAllPages, deletePage, publishPage, type DynamicPage } from '@/lib/api/dynamic-pages';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Eye, EyeOff, Globe, FileText, Image, Sparkles, LayoutGrid, ArrowRight } from 'lucide-react';

const templateIcons: Record<string, typeof FileText> = {
  promo: Sparkles,
  gallery: Image,
  simple: FileText,
};

const templateNames: Record<string, string> = {
  promo: 'Promo / Campaign',
  gallery: 'Gallery Showcase',
  simple: 'Simple Page',
};

export default function PagesListPage() {
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['dynamic-pages'],
    queryFn: getAllPages,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: () => {
      toast.success('Page deleted');
      queryClient.invalidateQueries({ queryKey: ['dynamic-pages'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, published }: { id: number; published: boolean }) =>
      publishPage(id, published),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dynamic-pages'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleDelete = (page: DynamicPage) => {
    if (confirm(`Are you sure you want to delete "${page.title}"?`)) {
      deleteMutation.mutate(page.id);
    }
  };

  const handleTogglePublish = (page: DynamicPage) => {
    publishMutation.mutate({ id: page.id, published: !page.is_published });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pages</h1>
          <p className="text-gray-500 mt-2">Manage your dynamic pages</p>
        </div>
        <Button asChild>
          <Link href="/admin/pages/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Page
          </Link>
        </Button>
      </div>

      {/* Helper Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Not sure which template to use?</p>
            <p className="text-sm text-gray-600">Preview live examples of Promo, Gallery, and Editorial layouts before you create a page.</p>
          </div>
        </div>
        <Button variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800" asChild>
          <Link href="/examples" target="_blank">
            Browse Templates
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Loading...</div>
      ) : pages.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-lg">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No pages yet</h3>
          <p className="text-gray-500 mt-1">Create your first dynamic page</p>
          <Button asChild className="mt-4">
            <Link href="/admin/pages/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Page
            </Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Page</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Template</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Slug</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {pages.map((page) => {
                const Icon = templateIcons[page.template_type] || FileText;
                return (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium">{page.title}</div>
                      {page.meta_description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {page.meta_description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{templateNames[page.template_type] || page.template_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        /{page.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => handleTogglePublish(page)}
                        disabled={publishMutation.isPending}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          page.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        {page.is_published ? (
                          <>
                            <Globe className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/${page.slug}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <Link href={`/admin/pages/${page.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(page)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
