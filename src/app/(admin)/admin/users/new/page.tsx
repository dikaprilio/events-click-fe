'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/hooks/use-admin-users';
import { toast } from 'sonner';

import { createUserSchema } from '@/lib/validations/admin-schemas';
import { ApiError } from '@/lib/api/client';
import { ArrowLeft } from 'lucide-react';

type CreateUserForm = z.infer<typeof createUserSchema>;

export default function NewUserPage() {
  const router = useRouter();
  const createUser = useCreateUser();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateUserForm>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'user',
    },
  });

  const onSubmit = async (data: CreateUserForm) => {
    try {
      await createUser.mutateAsync(data);
      toast.success('User created successfully');
      router.push('/admin/users');
    } catch (error) {
      if (error instanceof ApiError && error.fieldErrors) {
        error.fieldErrors.forEach((err) => {
          setError(err.field as any, { message: err.message });
        });
      } else {
        toast.error('Failed to create user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Add New User</h1>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
              <Input
                id="username"
                placeholder="Ex: johndoe"
                className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                {...register('username')}
              />
              {errors.username && (
                <p className="text-sm text-red-600 font-medium">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: john@example.com"
                className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 6 chars)"
                className="bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-600 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 font-medium">Account Role</Label>
              <select
                id="role"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-10"
                {...register('role')}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-600 font-medium">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Button
              type="submit"
              disabled={createUser.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11"
            >
              {createUser.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </div>
              ) : 'Create User'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/users')}
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
