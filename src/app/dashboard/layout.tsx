'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, FileText, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

const mockUser = {
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  avatarUrl: 'https://picsum.photos/seed/janedoe/100/100'
};

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

  return <DashboardLayout user={mockUser} sidebarContent={sidebarContent}>{children}</DashboardLayout>;
}
