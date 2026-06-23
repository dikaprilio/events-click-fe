'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  getAllNavLinks, 
  createNavLink, 
  updateNavLink, 
  deleteNavLink,
  reorderNavLinks,
  type NavLink 
} from '@/lib/api/nav-links';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowUp, ArrowDown, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';

export default function NavigationManagerPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ label: '', path: '' });

  // Fetch nav links
  const { data: navLinks = [], isLoading } = useQuery({
    queryKey: ['nav-links'],
    queryFn: getAllNavLinks,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createNavLink,
    onSuccess: () => {
      toast.success('Navigation link created');
      queryClient.invalidateQueries({ queryKey: ['nav-links'] });
      setFormData({ label: '', path: '' });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<NavLink> }) => updateNavLink(id, data),
    onSuccess: () => {
      toast.success('Navigation link updated');
      queryClient.invalidateQueries({ queryKey: ['nav-links'] });
      setEditingId(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteNavLink,
    onSuccess: () => {
      toast.success('Navigation link deleted');
      queryClient.invalidateQueries({ queryKey: ['nav-links'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: reorderNavLinks,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nav-links'] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.path) {
      toast.error('Label and path are required');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate({
        ...formData,
        display_order: navLinks.length,
        is_active: true,
      });
    }
  };

  const handleEdit = (link: NavLink) => {
    setEditingId(link.id);
    setFormData({ label: link.label, path: link.path });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ label: '', path: '' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this link?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleActive = (link: NavLink) => {
    updateMutation.mutate({
      id: link.id,
      data: { is_active: !link.is_active },
    });
  };

  const moveLink = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === navLinks.length - 1) return;

    const newLinks = [...navLinks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap
    [newLinks[index], newLinks[targetIndex]] = [newLinks[targetIndex], newLinks[index]];
    
    // Update display orders
    const orders = newLinks.map((link, i) => ({
      id: link.id,
      display_order: i,
    }));
    
    reorderMutation.mutate(orders);
  };

  // Sort by display order
  const sortedLinks = [...navLinks].sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Navigation Manager</h1>
        <p className="text-gray-500 mt-2">Manage your website navigation links</p>
      </div>

      {/* Add/Edit Form */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {editingId ? 'Edit Link' : 'Add New Link'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Services"
              />
            </div>
            <div>
              <Label htmlFor="path">Path</Label>
              <Input
                id="path"
                value={formData.path}
                onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                placeholder="e.g., /services"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Update Link
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Link
                </>
              )}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Links List */}
      <div className="bg-white border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Navigation Links</h2>
          <p className="text-sm text-gray-500">Drag or use arrows to reorder</p>
        </div>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : sortedLinks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No navigation links yet</div>
        ) : (
          <div className="divide-y">
            {sortedLinks.map((link, index) => (
              <div
                key={link.id}
                className={`p-4 flex items-center gap-4 ${!link.is_active ? 'bg-gray-50' : ''}`}
              >
                <GripVertical className="w-5 h-5 text-gray-400" />
                
                <div className="flex-1">
                  <div className="font-medium">{link.label}</div>
                  <div className="text-sm text-gray-500">{link.path}</div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Active toggle */}
                  <button
                    onClick={() => handleToggleActive(link)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      link.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {link.is_active ? 'Active' : 'Inactive'}
                  </button>

                  {/* Reorder buttons */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveLink(index, 'up')}
                      disabled={index === 0}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveLink(index, 'down')}
                      disabled={index === sortedLinks.length - 1}
                      className="p-1 hover:bg-gray-100 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Edit button */}
                  <button
                    onClick={() => handleEdit(link)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
