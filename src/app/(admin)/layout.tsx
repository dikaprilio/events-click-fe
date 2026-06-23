import type { ReactNode } from 'react';
import './admin-globals.css';

export const metadata = {
  title: 'Admin Dashboard | EventsClick',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
