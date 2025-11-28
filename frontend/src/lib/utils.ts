import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

export function formatPrice(cents: number): string {
    return new Intl.NumberFormat('my-MM', {
        style: 'currency',
        currency: 'MMK',
    }).format(cents);
}

export function formatDuration(days: number): string {
    if (days === 1) return '1 day';
    if (days === 7) return '1 week';
    if (days === 14) return '2 weeks';
    if (days === 30 || days === 31) return '1 month';
    if (days === 60 || days === 62) return '2 months';
    if (days === 90 || days === 92 || days === 93) return '3 months';
    if ((days >= 180 && days <= 186) || days === 180) return '6 months';
    if (days === 365 || days === 366) return '1 year';
    return `${days} days`;
}

export function getPackageFeatures(durationDays: number): string[] {
    const baseFeatures = ['Full gym access', 'Locker room access'];

    if (durationDays >= 30) {
        baseFeatures.push('Free fitness assessment');
    }
    if (durationDays >= 90) {
        baseFeatures.push('1 personal training session');
    }
    if (durationDays >= 180) {
        baseFeatures.push('Priority booking');
    }
    if (durationDays >= 365) {
        baseFeatures.push('Guest passes included');
    }

    return baseFeatures;
}
