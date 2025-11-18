'use client';

import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Gavel, List, BarChart2, Settings } from 'lucide-react';
import { usePathname } from 'next/navigation';

const mockUser = {
  name: 'Admin User',
  email: 'admin@abn.studio',
  avatarUrl: 'https://picsum.photos/seed/adminuser/100/100'
};

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/admin/participants', label: 'Participants', icon: Users },
    { href: '/admin/judges', label: 'Judges', icon: Gavel },
    { href: '/admin/categories', label: 'Categories', icon: List },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const sidebarContent = (
    <SidebarMenu>
        {navItems.map(item => (
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
