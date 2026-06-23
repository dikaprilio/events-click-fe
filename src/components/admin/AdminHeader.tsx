'use client';

import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function AdminHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="hidden md:flex fixed top-0 right-0 left-64 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 items-center justify-between px-10">
      <div className="flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          Dashboard <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span className="text-indigo-600">Overview</span>
        </h2>
        <p className="text-xs text-slate-500 font-medium tracking-wide">Welcome back, {user?.username || 'Admin'}</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100 flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest leading-none">
            {user?.role}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-full transition-all shadow-lg shadow-slate-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export function AdminMobileHeader() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-30 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="font-semibold text-gray-900">{user?.username || 'Admin'}</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <UserIcon className="w-5 h-5" />
            <span className="text-sm font-medium capitalize">{user?.role}</span>
            <ChevronIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[-1]"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                >
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <LogoutIcon className="w-4 h-4" />
                    Logout
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}
