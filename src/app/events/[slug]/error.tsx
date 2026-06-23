'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function EventDetailError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Event detail error:', error);
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
                  d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-bold mb-4 text-foreground">
              Event Not Found
            </h1>
            
            <p className="text-muted-foreground mb-8">
              We couldn&apos;t find the event you&apos;re looking for. It may have been removed or the URL might be incorrect.
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
              <Link href="/events" className="btn btn-outline">
                View All Events
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
