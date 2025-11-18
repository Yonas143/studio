'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { ListChecks, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function JudgeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, userProfile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || userProfile?.role !== 'judge')) {
      router.push('/login');
    }
  }, [user, userProfile, loading, router]);

  if (loading || !userProfile) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 border-r p-4 space-y-4">
            <Skeleton className="h-10 w-full" />
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
      <SidebarMenuItem>
        <SidebarMenuButton href="/judge" isActive={pathname === '/judge' || pathname.startsWith('/judge/submission')}>
          <ListChecks />
          Assigned Submissions
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton href="#">
          <User />
          Profile
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );

  const judgeUser = {
    name: userProfile.name,
    email: userProfile.email,
    avatarUrl: user?.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`
  };

  return <DashboardLayout user={judgeUser} sidebarContent={sidebarContent}>{children}</DashboardLayout>;
}
