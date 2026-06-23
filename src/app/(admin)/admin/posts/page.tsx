'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePosts } from '@/hooks/use-posts';
import { useDeletePost } from '@/hooks/use-admin-posts';
import { getImageUrl, formatDate } from '@/lib/utils';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Post } from '@/types/post';

export default function AdminPostsPage() {
  const { data: posts, isLoading, error } = usePosts();
  const deletePost = useDeletePost();
  const [postToDelete, setPostToDelete] = useState<Post | null>(null);

  const handleDelete = async () => {
    if (!postToDelete) return;
    
    try {
      await deletePost.mutateAsync(postToDelete.id);
      toast.success('Post deleted successfully');
      setPostToDelete(null);
    } catch {
      toast.error('Failed to delete post');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-center">
          <p className="text-red-600 font-medium">Failed to load posts</p>
          <p className="text-gray-500 text-sm mt-1">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Post
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Image</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Title</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 hidden sm:table-cell">Event</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 hidden md:table-cell">Tag</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 hidden lg:table-cell">Date</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts?.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="relative w-16 h-10 rounded overflow-hidden bg-gray-100">
                    {post.images?.[0]?.url ? (
                      <Image
                        src={getImageUrl(post.images[0].url)}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[200px]">{post.title}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <p className="text-gray-600 truncate max-w-[150px]">{post.event_name}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {post.tag?.name || 'Uncategorized'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-gray-600">
                    {formatDate(post.created_at)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                      title="Edit"
                    >
                      <EditIcon className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setPostToDelete(post)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {posts?.length === 0 && (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-white">
          <p className="text-gray-500">No posts found</p>
          <Link
            href="/admin/posts/new"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            Create your first post
          </Link>
        </div>
      )}

      <Dialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Delete Post</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete &quot;{postToDelete?.title}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPostToDelete(null)} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deletePost.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletePost.isPending ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
