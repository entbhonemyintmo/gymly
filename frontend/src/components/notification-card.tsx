import { Check, Package, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import type { Notification, NotificationType } from '../api/notifications';

const NOTIFICATION_ICONS: Record<NotificationType, typeof Package> = {
    subscription_request: Package,
    subscription_approved: CheckCircle2,
    subscription_rejected: XCircle,
};

const NOTIFICATION_COLORS: Record<NotificationType, { icon: string; bg: string; border: string }> = {
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
};

interface NotificationCardProps {
    notification: Notification;
    index: number;
    onMarkAsRead: (id: number) => void;
}

export function NotificationCard({ notification, index, onMarkAsRead }: NotificationCardProps) {
    const Icon = NOTIFICATION_ICONS[notification.type];
    const colors = NOTIFICATION_COLORS[notification.type];

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
                'relative rounded-2xl border bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in',
                notification.isRead
                    ? 'border-gray-100'
                    : 'border-gymly-emerald-500/50 ring-1 ring-gymly-emerald-500/20',
            )}
            style={{ animationDelay: `${index * 60}ms` }}
        >
            {/* Unread indicator */}
            {!notification.isRead && (
                <span className="absolute left-3 top-3 h-2.5 w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
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
                                    'text-base text-gray-900',
                                    !notification.isRead && 'font-semibold',
                                )}
                            >
                                {notification.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 leading-relaxed">{notification.body}</p>
                        </div>

                        {/* Mark as read button */}
                        {!notification.isRead && (
                            <button
                                onClick={() => onMarkAsRead(notification.id)}
                                className="shrink-0 rounded-xl bg-gray-50 p-2 text-gray-400 transition-all hover:bg-green-50 hover:text-green-600"
                                title="Mark as read"
                            >
                                <Check className="h-5 w-5" />
                            </button>
                        )}
                    </div>

                    {/* Timestamp */}
                    <p className="mt-3 text-xs text-gray-400">{formatDate(notification.createdAt)}</p>
                </div>
            </div>
        </div>
    );
}

