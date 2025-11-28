import { LayoutDashboard, CalendarCheck, CreditCard, type LucideIcon } from 'lucide-react';

export interface AdminNavItem {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
    roles: ('admin' | 'staff')[];
}

export const adminNavigationItems: AdminNavItem[] = [
    {
        href: '/admin',
        title: 'Dashboard',
        description: 'Overview and quick stats',
        icon: LayoutDashboard,
        roles: ['admin', 'staff'],
    },
    {
        href: '/admin/checkins',
        title: 'Check-ins',
        description: 'View all check-ins and check in members',
        icon: CalendarCheck,
        roles: ['admin', 'staff'],
    },
    {
        href: '/admin/subscriptions',
        title: 'Subscriptions',
        description: 'Manage member subscriptions',
        icon: CreditCard,
        roles: ['admin'],
    },
];

export const defaultAdminNavItem: AdminNavItem = {
    href: '/admin',
    title: 'Admin Panel',
    description: 'Manage your gym',
    icon: LayoutDashboard,
    roles: ['admin', 'staff'],
};

export function getAdminNavItemByPath(pathname: string): AdminNavItem {
    const exactMatch = adminNavigationItems.find((item) => item.href === pathname);
    if (exactMatch) return exactMatch;

    const prefixMatch = adminNavigationItems.find((item) => item.href !== '/admin' && pathname.startsWith(item.href));
    return prefixMatch ?? defaultAdminNavItem;
}

export function isAdminNavItemActive(item: AdminNavItem, pathname: string): boolean {
    if (item.href === '/admin') {
        return pathname === '/admin';
    }
    return pathname === item.href || pathname.startsWith(item.href);
}

export function filterNavItemsByRole(role: string): AdminNavItem[] {
    return adminNavigationItems.filter((item) => item.roles.includes(role as 'admin' | 'staff'));
}
