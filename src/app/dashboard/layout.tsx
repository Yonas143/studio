'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/submissions', label: 'My Submissions', icon: FileText },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
];

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !userProfile) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 border-r p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
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
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton href={item.href} isActive={pathname === item.href}>
            <item.icon />
            {item.label}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );

  const dashboardUser = {
    name: userProfile.name,
    email: userProfile.email,
    avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
  };

  return <DashboardLayout user={dashboardUser} sidebarContent={sidebarContent}>{children}</DashboardLayout>;
}
