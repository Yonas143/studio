'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Gavel, List, BarChart2, Settings, FileText, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/submissions', label: 'Submissions', icon: FileText },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/admin/participants', label: 'Participants', icon: Users },
    { href: '/admin/judges', label: 'Judges', icon: Gavel },
    { href: '/admin/categories', label: 'Categories', icon: List },
    { href: '/admin/nominees', label: 'Nominees', icon: UserPlus },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);

  if (loading || !user || !userProfile) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 border-r p-4 space-y-4 bg-sidebar">
            <Skeleton className="h-10 w-full bg-sidebar-accent" />
            <div className="p-2 space-y-2">
              <Skeleton className="h-8 w-full bg-sidebar-accent" />
              <Skeleton className="h-8 w-full bg-sidebar-accent" />
              <Skeleton className="h-8 w-full bg-sidebar-accent" />
            </div>
        </div>
        <div className="flex-1 p-8 space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }
  
  const sidebarContent = (
    <SidebarMenu>
        {navItems.map(item => (
             <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <span>
                      <item.icon />
                      {item.label}
                    </span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );

  return <DashboardLayout user={{name: userProfile.name, email: userProfile.email, avatarUrl: user?.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`}} sidebarContent={sidebarContent}><FirebaseErrorListener />{children}</DashboardLayout>;
}
