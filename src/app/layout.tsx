import localFont from 'next/font/local';
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { SideAd } from '@/components/ads/side-ad';
import { ContactPopup } from '@/components/contact-popup';
import { FirebaseClientProvider } from '@/firebase/client-provider';


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
  description: 'Promoting, judging, and celebrating Ethiopian cultural excellence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body text-foreground antialiased',
          lemonMilk.variable
        )}
      >
        <FirebaseClientProvider>
          <div className="relative flex min-h-dvh flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />

            {/* Side Ads - Visible only on large screens */}
            <SideAd side="left" />
            <SideAd side="right" />

            <ContactPopup />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
