'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Trophy, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { NavItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/icons';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const mainNav: NavItem[] = [
  
  { title: 'Categories', href: '/categories' },
  { title: 'Nominees', href: '/nominees' },
  { title: 'Submit', href: '/submit' },
  
  { title: 'Cultural insight', href: '/Culturalinsight' },
  { title: 'About', href: '/about' },
];


export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, loading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut(auth);
    document.cookie = "is-logged-in=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    router.push('/');
  };

  const getDashboardUrl = () => {
    if (!userProfile) return '/login';
    switch (userProfile.role) {
      case 'admin':
        return '/admin';
      case 'judge':
        return '/judge';
      case 'participant':
        return '/dashboard';
      default:
        return '/dashboard';
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-6 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="font-headline font-bold sm:inline-block">
              Cultural Ambassador Award
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
            {user && userProfile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt={userProfile.name} />
                      <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userProfile.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userProfile.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={getDashboardUrl()}>Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : !loading && (
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
              <Link href="/nominees"><Trophy className="mr-2 h-4 w-4" /> Vote</Link>
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
                  {mainNav.map((item) => (
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
                  {user && (
                    <Link
                      href={getDashboardUrl()}
                      className={cn(
                        'text-lg font-medium transition-colors hover:text-primary',
                        pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin') || pathname?.startsWith('/judge')
                          ? 'text-primary'
                          : 'text-foreground/80'
                      )}
                    >
                      Dashboard
                    </Link>
                  )}
                </div>
                <div className="mt-auto flex flex-col gap-2">
                  {user ? (
                    <Button onClick={handleSignOut} variant="outline" className="w-full">Log Out</Button>
                  ) : (
                    <>
                      <Button asChild className="w-full">
                        <Link href="/register">Sign Up</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/login">Log In</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
