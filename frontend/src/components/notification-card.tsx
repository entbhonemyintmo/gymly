import { Check, Package, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Notification, NotificationType } from '../api/notifications';

export type NotificationVariant = 'user' | 'admin';

const NOTIFICATION_ICONS: Record<NotificationType, typeof Package> = {
    subscription_request: Package,
    subscription_approved: CheckCircle2,
    subscription_rejected: XCircle,
};

const NOTIFICATION_COLORS: Record<
    NotificationVariant,
    Record<NotificationType, { icon: string; bg: string; border: string }>
> = {
    user: {
        subscription_request: {
            icon: 'text-blue-500',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
        },
        subscription_approved: {
            icon: 'text-green-500',
            bg: 'bg-green-50',
            border: 'border-green-100',
        },
        subscription_rejected: {
            icon: 'text-red-500',
            bg: 'bg-red-50',
            border: 'border-red-100',
        },
    },
    admin: {
        subscription_request: {
            icon: 'text-blue-400',
            bg: 'bg-blue-500/20',
            border: 'border-blue-500/30',
        },
        subscription_approved: {
            icon: 'text-gymly-green-400',
            bg: 'bg-gymly-green-500/20',
            border: 'border-gymly-green-500/30',
        },
        subscription_rejected: {
            icon: 'text-red-400',
            bg: 'bg-red-500/20',
            border: 'border-red-500/30',
        },
    },
};

interface NotificationCardProps {
    notification: Notification;
    index: number;
    onMarkAsRead: (id: number) => void;
    variant?: NotificationVariant;
}

export function NotificationCard({ notification, index, onMarkAsRead, variant = 'user' }: NotificationCardProps) {
    const Icon = NOTIFICATION_ICONS[notification.type];
    const colors = NOTIFICATION_COLORS[variant][notification.type];
    const isAdmin = variant === 'admin';

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        });
    };

    return (
        <div
            className={cn(
                'relative rounded-2xl border p-5 transition-all duration-300 animate-fade-in',
                isAdmin
                    ? cn(
                          'bg-slate-900/50 hover:bg-slate-800/50',
                          notification.isRead
                              ? 'border-slate-800'
                              : 'border-gymly-green-500/30 ring-1 ring-gymly-green-500/20',
                      )
                    : cn(
                          'bg-white shadow-sm hover:shadow-md',
                          notification.isRead
                              ? 'border-gray-100'
                              : 'border-gymly-emerald-500/50 ring-1 ring-gymly-emerald-500/20',
                      ),
            )}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Unread indicator */}
            {!notification.isRead && (
                <span className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full bg-gymly-green-500 shadow-lg shadow-gymly-green-500/50" />
            )}

            <div className="flex gap-4">
                {/* Icon */}
                <div
                    className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border',
                        colors.bg,
                        colors.border,
                    )}
                >
                    <Icon className={cn('h-6 w-6', colors.icon)} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                            <h3
                                className={cn(
                                    'text-base',
                                    isAdmin
                                        ? cn('text-slate-200', !notification.isRead && 'font-semibold text-white')
                                        : cn('text-gray-900', !notification.isRead && 'font-semibold'),
                                )}
                            >
                                {notification.title}
                            </h3>
                            <p
                                className={cn(
                                    'mt-1 text-sm leading-relaxed',
                                    isAdmin ? 'text-slate-400' : 'text-gray-600',
                                )}
                            >
                                {notification.body}
                            </p>
                        </div>

                        {/* Mark as read button */}
                        {!notification.isRead && (
                            <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className={cn(
                                    'shrink-0 rounded-xl p-2 transition-all',
                                    isAdmin
                                        ? 'bg-slate-800 text-slate-400 hover:bg-gymly-green-500/20 hover:text-gymly-green-400'
                                        : 'bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600',
                                )}
                                title="Mark as read"
                            >
                                <Check className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Timestamp */}
                    <p className={cn('mt-3 text-xs', isAdmin ? 'text-slate-500' : 'text-gray-400')}>
                        {formatDate(notification.createdAt)}
                    </p>
                </div>
            </div>
        </div>
    );
}

