'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EventsError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Events page error:', error);
  }, [error]);

  return (
    <div className="pt-20 min-h-screen">
      <section className="py-20 text-center">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-card p-12 max-w-2xl mx-auto">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Failed to Load Events
            </h1>
            
            <p className="text-muted-foreground mb-8">
              We&apos;re having trouble loading the events. This might be a temporary issue.
              Please try again or contact support if the problem persists.
            </p>

            {error.message && process.env.NODE_ENV === 'development' && (
              <div className="mb-8 p-4 bg-red-500/10 rounded-lg text-left">
                <p className="text-sm text-red-400 font-mono">
                  Error: {error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="btn btn-primary"
              >
                Try Again
              </button>
              <Link href="/" className="btn btn-outline">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
