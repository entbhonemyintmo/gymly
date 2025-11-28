import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Check, CheckCheck, Loader2, X, ExternalLink, Package, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    type Notification,
    type NotificationType,
} from '../api/notifications';

const NOTIFICATION_ICONS: Record<NotificationType, typeof Package> = {
    subscription_request: Package,
    subscription_approved: CheckCircle2,
    subscription_rejected: XCircle,
};

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
    subscription_request: 'text-blue-500 bg-blue-50',
    subscription_approved: 'text-green-500 bg-green-50',
    subscription_rejected: 'text-red-500 bg-red-50',
};

interface NotificationDropdownProps {
    notificationsPageLink?: string;
    className?: string;
}

export function NotificationDropdown({
    notificationsPageLink = '/notifications',
    className,
}: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data: unreadData } = useQuery({
        queryKey: ['notificationsUnreadCount'],
        queryFn: getUnreadCount,
        refetchInterval: 30000,
    });

    const { data: notificationsData, isLoading } = useQuery({
        queryKey: ['notificationsDropdown'],
        queryFn: () => getNotifications({ limit: 5 }),
        enabled: isOpen,
    });

    const markAsReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['notificationsDropdown'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['notificationsDropdown'] });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        },
    });

    const unreadCount = unreadData?.count ?? 0;
    const notifications = notificationsData?.data ?? [];

    const handleMarkAsRead = (notification: Notification) => {
        if (!notification.isRead) {
            markAsReadMutation.mutate([notification.id]);
        }
    };

    const handleMarkAllAsRead = () => {
        if (unreadCount > 0) {
            markAllAsReadMutation.mutate();
        }
    };

    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200',
                    'bg-white/20 backdrop-blur-sm hover:bg-white/30',
                    isOpen && 'bg-white/30 ring-2 ring-white/30',
                )}
                aria-label="Notifications"
            >
                <Bell className="h-5 w-5 text-white" />
                {unreadCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-lg">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-80 animate-scale-in origin-top-right rounded-2xl border border-gray-100 bg-white shadow-xl sm:w-96">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    disabled={markAllAsReadMutation.isPending}
                                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-50 disabled:opacity-50"
                                >
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-green-500" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center">
                                <Bell className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-2 text-sm text-gray-500">No notifications yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => {
                                    const Icon = NOTIFICATION_ICONS[notification.type];
                                    const colorClass = NOTIFICATION_COLORS[notification.type];

                                    return (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleMarkAsRead(notification)}
                                            className={cn(
                                                'relative flex gap-3 px-4 py-3 transition-colors cursor-pointer hover:bg-gray-50',
                                                !notification.isRead && 'bg-green-50/50',
                                            )}
                                        >
                                            {/* Unread indicator */}
                                            {!notification.isRead && (
                                                <span className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-green-500" />
                                            )}

                                            {/* Icon */}
                                            <div
                                                className={cn(
                                                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                                    colorClass,
                                                )}
                                            >
                                                <Icon className="h-5 w-5" />
                                            </div>

                                            {/* Content */}
                                            <div className="min-w-0 flex-1">
                                                <p
                                                    className={cn(
                                                        'text-sm text-gray-900 line-clamp-1',
                                                        !notification.isRead && 'font-semibold',
                                                    )}
                                                >
                                                    {notification.title}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
                                                    {notification.body}
                                                </p>
                                                <p className="mt-1 text-[10px] text-gray-400">
                                                    {formatTimeAgo(notification.createdAt)}
                                                </p>
                                            </div>

                                            {/* Mark as read button */}
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notification);
                                                    }}
                                                    className="shrink-0 self-center rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-green-600"
                                                    title="Mark as read"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-100 px-4 py-3">
                        <Link
                            to={notificationsPageLink}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                        >
                            <span>View all notifications</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
