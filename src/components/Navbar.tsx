'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from './ThemeToggle';
import { useTheme } from 'next-themes';

import { navLinks } from '@/data/navigation';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Safe theme resolution to prevent hydration mismatch
  const currentTheme = mounted ? resolvedTheme : 'light';

  return (
    <>
      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-700 ease-in-out flex justify-center ${isScrolled
          ? 'top-4 px-4'
          : 'top-0 py-5 bg-transparent'
          }`}
      >
        <div
          className={`w-full flex items-center justify-between border transition-all duration-700 ease-in-out ${isScrolled
            ? 'max-w-5xl rounded-full px-6 py-3 shadow-lg border-foreground/10'
            : 'max-w-7xl px-6 rounded-none border-transparent shadow-none'
            } ${isScrolled
              ? currentTheme === 'dark'
                ? 'liquid-glass'
                : 'bg-primary'
              : ''
            }`}
        >
          <Link href="/" className="relative z-50 flex-shrink-0 h-8 md:h-10 w-32">
            {/* Cross-fading Logos */}
            <div className="relative w-full h-full">
              <Image
                src="/blue-bg-white-text-logo.png"
                alt="eventsclick Logo Color"
                fill
                className={`object-contain transition-opacity duration-700 ease-in-out ${isScrolled && currentTheme === 'light' ? 'opacity-0' : currentTheme === 'light' ? 'opacity-100' : 'opacity-0'
                  }`}
                priority
              />
              <Image
                src="/white-logo-no-bg.png"
                alt="eventsclick Logo White"
                fill
                className={`object-contain transition-opacity duration-700 ease-in-out absolute inset-0 ${isScrolled || currentTheme === 'dark' ? 'opacity-100' : 'opacity-0'
                  }`}
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors duration-700 ease-in-out relative group hover:text-primary ${isScrolled
                  ? currentTheme === 'light' ? 'text-white hover:text-white/80' : 'text-foreground'
                  : 'text-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}

            <ThemeToggle isNavbarScrolled={isScrolled && currentTheme === 'light'} />

            <Link
              href="/contact"
              className="btn btn-primary px-5 py-2 text-sm"
            >
              Get in Touch
            </Link>
          </nav>

          {/* Mobile Hamburger */}
          <div className="flex items-center gap-4 md:hidden z-50">
            <ThemeToggle isNavbarScrolled={isScrolled && currentTheme === 'light'} />

            <button
              className={`flex flex-col justify-center gap-1.5 w-6 h-6 transition-colors duration-700 ease-in-out ${isScrolled && currentTheme === 'light' ? 'text-white' : 'text-foreground'
                }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-full h-0.5 bg-current transition-all duration-700 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-current transition-all duration-700 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-full h-0.5 bg-current transition-all duration-700 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-background/95 backdrop-blur-3xl z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-3xl font-display font-bold text-foreground hover:text-primary"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/contact"
          className="btn btn-primary mt-4"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Get in Touch
        </Link>
      </div>
    </>
  );
}
