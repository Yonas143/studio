import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Separator } from '../ui/separator';

type DashboardLayoutProps = {
  children: React.ReactNode;
  sidebarContent: React.ReactNode;
  user: {
    name: string;
    email: string;
    avatarUrl: string;
  };
};

export function DashboardLayout({
  children,
  sidebarContent,
  user,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar
          variant="inset"
          collapsible="icon"
          className="hidden md:flex"
        >
          <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 font-headline font-bold text-lg">
              <NextImage src="/logo.jpg" alt="Cultural Ambassador Award" width={32} height={32} className="size-8 object-contain rounded-full" />
              <span className="group-data-[collapsible=icon]:hidden text-sm">
                Cultural Ambassador Award
              </span>
            </Link>
          </SidebarHeader>
          <Separator />
          <SidebarContent>{sidebarContent}</SidebarContent>
          <Separator />
          <SidebarFooter>
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-sidebar-foreground/70">{user.email}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4">
              <span className='text-sm hidden sm:inline'>{user.name}</span>
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/"><LogOut className="h-4 w-4" /></Link>
              </Button>
            </div>
          </header>
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
