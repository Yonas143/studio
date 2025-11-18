'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { ListChecks, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const mockUser = {
  name: 'Judge Kafu',
  email: 'judge.kafu@example.com',
  avatarUrl: 'https://picsum.photos/seed/judgekafu/100/100'
};

export default function JudgeDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

  return <DashboardLayout user={mockUser} sidebarContent={sidebarContent}>{children}</DashboardLayout>;
}
