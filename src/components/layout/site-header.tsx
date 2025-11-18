'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Trophy } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/icons';

const mainNav: NavItem[] = [
  { title: 'Categories', href: '/categories' },
  { title: 'Nominees', href: '/nominees' },
  { title: 'Submit', href: '/submit' },
];

const authenticatedNav: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Admin', href: '/admin' },
  { title: 'Judge', href: '/judge' },
]

export function SiteHeader() {
  const pathname = usePathname();
  // Mock authentication state
  const isAuthenticated = false;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-headline font-bold sm:inline-block">
              ABN Awards
            </span>
          </Link>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname?.startsWith(item.href)
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden items-center space-x-2 md:flex">
             {isAuthenticated ? (
                <Button asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
             <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
                <Link href="/vote"><Trophy className="mr-2 h-4 w-4"/> Vote</Link>
             </Button>
          </nav>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-2 md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <Link href="/" className="flex items-center space-x-2">
                    <Logo className="h-8 w-8 text-primary" />
                    <span className="font-headline font-bold">ABN Awards</span>
                  </Link>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                  {[...mainNav, ...authenticatedNav].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                        pathname?.startsWith(item.href)
                          ? 'text-primary'
                          : 'text-foreground/80'
                      )}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-2">
                    <Button asChild className="w-full">
                      <Link href="/register">Sign Up</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/login">Log In</Link>
                    </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
