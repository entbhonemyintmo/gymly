import { Home, Package, User, Dumbbell, type LucideIcon } from 'lucide-react';

export interface NavItem {
    href: string;
    title: string;
    description: string;
    icon: LucideIcon;
}

export const navigationItems: NavItem[] = [
    {
        href: '/',
        title: 'Home',
        description: 'Track your fitness journey and discover new offers',
        icon: Home,
    },
    {
        href: '/my-vouchers',
        title: 'My Vouchers',
        description: 'View and manage your active vouchers',
        icon: Package,
    },
    {
        href: '/profile',
        title: 'Profile',
        description: 'Manage your account settings',
        icon: User,
    },
];

export const defaultNavItem: NavItem = {
    href: '',
    title: 'Gymly',
    description: 'Your fitness companion',
    icon: Dumbbell,
};

export function getNavItemByPath(pathname: string): NavItem {
    const exactMatch = navigationItems.find((item) => item.href === pathname);
    if (exactMatch) return exactMatch;

    const prefixMatch = navigationItems.find((item) => item.href !== '/' && pathname.startsWith(item.href));
    return prefixMatch ?? defaultNavItem;
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
    return pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
}
