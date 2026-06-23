'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';
import { getAllNavLinks, type NavLink } from '@/lib/api/nav-links';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    // Fetch dynamic nav links
    const fetchLinks = async () => {
      try {
        const links = await getAllNavLinks();
        const activeLinks = links
          .filter(link => link.is_active)
          .sort((a, b) => a.display_order - b.display_order);
        setNavLinks(activeLinks);
      } catch (error) {
        console.error('Failed to fetch nav links:', error);
        setNavLinks([
          { id: 1, label: 'Home', path: '/', display_order: 0, is_active: true, created_at: '' },
          { id: 2, label: 'Events', path: '/events', display_order: 1, is_active: true, created_at: '' },
          { id: 3, label: 'Equipments', path: '/equipments', display_order: 2, is_active: true, created_at: '' },
          { id: 4, label: 'Contact', path: '/contact', display_order: 3, is_active: true, created_at: '' },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLinks();

    // Scroll listener for transformation
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentTheme = mounted ? resolvedTheme : 'light';
  const isDark = currentTheme === 'dark';

  return (
    <>
      <header 
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'top-4 px-4 sm:px-6' 
            : 'top-0 px-0'
        }`}
      >
        <div 
          className={`mx-auto flex items-center justify-between transition-all duration-500 ${
            isScrolled 
              ? 'max-w-6xl px-6 py-3 rounded-full bg-primary shadow-xl' 
              : isDark 
                ? 'max-w-full px-6 sm:px-10 py-5 bg-transparent' 
                : 'max-w-full px-6 sm:px-10 py-5 bg-primary'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="relative z-50 flex-shrink-0 h-8 w-32">
            <div className="relative w-full h-full">
              <Image
                src="/white-logo-no-bg.png"
                alt="eventsclick Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {isLoading ? (
              <div className="flex gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-14 h-4 rounded animate-pulse bg-white/20" />
                ))}
              </div>
            ) : (
              navLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))
            )}

            <ThemeToggle isNavbarScrolled={true} />

            <Link
              href="/contact"
              className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 animate-button-pulse ${
                isScrolled 
                  ? 'bg-white text-primary hover:bg-white/90 hover:scale-105' 
                  : 'bg-white text-primary hover:bg-white/90 hover:scale-105'
              }`}
            >
              Get in Touch
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-3 md:hidden z-50">
            <ThemeToggle isNavbarScrolled={true} />

            <button
              className="flex flex-col justify-center gap-1.5 w-6 h-6 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-primary z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.id}
            href={link.path}
            className="text-3xl font-display font-bold text-white hover:text-white/80"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="bg-white text-primary px-8 py-3 text-lg font-medium rounded-full mt-4"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Get in Touch
        </Link>
      </div>
    </>
  );
}
