'use client';

import { ReactNode, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

/**
 * Create a client-side QueryClient instance
 * This ensures data is not shared between users
 */
function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Default stale time: 5 minutes
        staleTime: 1000 * 60 * 5,
        // Refetch on window focus: disabled (prevents unnecessary refetching)
        refetchOnWindowFocus: false,
        // Retry failed requests: 1 time
        retry: 1,
        // Retry delay: exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  });
}

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Create QueryClient once per component lifecycle
  // Using useState ensures it's only created once
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster position="top-right" richColors />
      </ThemeProvider>
      {/* React Query DevTools - only visible in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
