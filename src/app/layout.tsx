import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";

import { Providers } from "./providers";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import WhatsAppButton from "@/components/WhatsAppButton";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "eventsclick | Event Organizer & Creative Agency",
  description: "We create a better live. Unforgettable experiences, lasting impact. Full-service Event Design, Planning & Production agency for MICE, Brand, & Corporate Events in Semarang, Indonesia.",
  keywords: "event organizer, semarang, creative agency, MICE, corporate events, brand activation, exhibition",
  authors: [{ name: "eventsclick" }],
  openGraph: {
    title: "eventsclick | Event Organizer & Creative Agency",
    description: "We create a better live. Unforgettable experiences, lasting impact.",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${jakarta.variable} ${outfit.variable} antialiased bg-background text-foreground transition-colors duration-300`}>

        <Providers>
          <SmoothScroll />
          <CustomCursor />
          <LayoutWrapper>
            <main>{children}</main>
          </LayoutWrapper>
          <WhatsAppButton />
        </Providers>
      </body>
    </html>
  );
}
