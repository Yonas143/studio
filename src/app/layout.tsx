import localFont from 'next/font/local';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { ContactPopup } from '@/components/contact-popup';
import { BottomAdBanner } from '@/components/ads/bottom-ad-banner';


const lemonMilk = localFont({
  src: [
    {
      path: '../../public/files/LEMONMILK-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/files/LEMONMILK-LightItalic.otf',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../../public/files/LEMONMILK-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/files/LEMONMILK-RegularItalic.otf',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/files/LEMONMILK-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/files/LEMONMILK-MediumItalic.otf',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/files/LEMONMILK-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/files/LEMONMILK-BoldItalic.otf',
      weight: '700',
      style: 'italic',
    },
  ],
  variable: '--font-lemon-milk',
});

export const metadata: Metadata = {
  title: 'Cultural Ambassador Award',
  description: 'Promoting and celebrating Ethiopian cultural excellence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-foreground antialiased',
          lemonMilk.variable
        )}
      >
        <div className="relative flex min-h-dvh flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />

          <ContactPopup />
          <BottomAdBanner />
        </div>
        <Toaster />
      </body>
    </html>
  );
}

