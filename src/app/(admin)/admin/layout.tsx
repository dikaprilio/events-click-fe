'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { AdminSidebar, AdminHeader, AdminMobileHeader, AdminBottomNav } from '@/components/admin';

const queryClient = new QueryClient();

function AdminLayoutContent({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900">
      <AdminSidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <AdminHeader />
        <AdminMobileHeader />
        <main className="flex-1 min-h-0 pt-20 pb-20 md:pb-12 px-4 md:px-10 max-w-7xl mx-auto w-full">
          <div className="animate-fade-in-up h-full">
            {children}
          </div>
        </main>
      </div>
      <AdminBottomNav />
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </AuthProvider>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
