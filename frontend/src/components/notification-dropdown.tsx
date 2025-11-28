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

type DropdownVariant = 'user' | 'admin';

const NOTIFICATION_COLORS: Record<DropdownVariant, Record<NotificationType, string>> = {
    user: {
        subscription_request: 'text-blue-500 bg-blue-50',
        subscription_approved: 'text-green-500 bg-green-50',
        subscription_rejected: 'text-red-500 bg-red-50',
    },
    admin: {
        subscription_request: 'text-blue-400 bg-blue-500/20',
        subscription_approved: 'text-gymly-green-400 bg-gymly-green-500/20',
        subscription_rejected: 'text-red-400 bg-red-500/20',
    },
};

interface NotificationDropdownProps {
    notificationsPageLink?: string;
    className?: string;
    variant?: DropdownVariant;
}

export function NotificationDropdown({
    notificationsPageLink = '/notifications',
    className,
    variant = 'user',
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

    const isAdmin = variant === 'admin';

    return (
        <div ref={dropdownRef} className={cn('relative', className)}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'relative flex h-9 w-9 items-center justify-center transition-all duration-200',
                    isAdmin
                        ? cn(
                              'rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white',
                              isOpen && 'bg-slate-800 text-white ring-2 ring-gymly-green-500/30',
                          )
                        : cn(
                              'rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30',
                              isOpen && 'bg-white/30 ring-2 ring-white/30',
                          ),
                )}
                aria-label="Notifications"
            >
                <Bell className={cn('h-5 w-5', !isAdmin && 'text-white')} />
                {unreadCount > 0 && (
                    <span
                        className={cn(
                            'absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold text-white shadow-lg',
                            isAdmin ? 'bg-gymly-green-500 shadow-gymly-green-500/30' : 'bg-red-500',
                        )}
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className={cn(
                        'absolute right-0 top-full z-50 mt-2 w-80 animate-scale-in origin-top-right rounded-2xl border shadow-xl sm:w-96',
                        isAdmin ? 'border-slate-700/50 bg-slate-900 shadow-black/20' : 'border-gray-100 bg-white',
                    )}
                >
                    {/* Header */}
                    <div
                        className={cn(
                            'flex items-center justify-between border-b px-4 py-3',
                            isAdmin ? 'border-slate-700/50' : 'border-gray-100',
                        )}
                    >
                        <h3 className={cn('font-semibold', isAdmin ? 'text-white' : 'text-gray-900')}>Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    disabled={markAllAsReadMutation.isPending}
                                    className={cn(
                                        'flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50',
                                        isAdmin
                                            ? 'text-gymly-green-400 hover:bg-gymly-green-500/10'
                                            : 'text-green-600 hover:bg-green-50',
                                    )}
                                >
                                    <CheckCheck className="h-3.5 w-3.5" />
                                    Mark all read
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                    'rounded-lg p-1 transition-colors',
                                    isAdmin
                                        ? 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                        : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600',
                                )}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="h-6 w-6 animate-spin text-gymly-green-500" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="py-8 text-center">
                                <Bell
                                    className={cn('mx-auto h-10 w-10', isAdmin ? 'text-slate-600' : 'text-gray-300')}
                                />
                                <p className={cn('mt-2 text-sm', isAdmin ? 'text-slate-400' : 'text-gray-500')}>
                                    No notifications yet
                                </p>
                            </div>
                        ) : (
                            <div className={cn('divide-y', isAdmin ? 'divide-slate-800/50' : 'divide-gray-50')}>
                                {notifications.map((notification) => {
                                    const Icon = NOTIFICATION_ICONS[notification.type];
                                    const colorClass = NOTIFICATION_COLORS[variant][notification.type];

                                    return (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleMarkAsRead(notification)}
                                            className={cn(
                                                'relative flex gap-3 px-4 py-3 transition-colors cursor-pointer',
                                                isAdmin
                                                    ? cn(
                                                          'hover:bg-slate-800/50',
                                                          !notification.isRead && 'bg-gymly-green-500/5',
                                                      )
                                                    : cn('hover:bg-gray-50', !notification.isRead && 'bg-green-50/50'),
                                            )}
                                        >
                                            {/* Unread indicator */}
                                            {!notification.isRead && (
                                                <span className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gymly-green-500 shadow-lg shadow-gymly-green-500/50" />
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
                                                        'text-sm line-clamp-1',
                                                        isAdmin
                                                            ? cn(
                                                                  'text-slate-200',
                                                                  !notification.isRead && 'font-semibold text-white',
                                                              )
                                                            : cn(
                                                                  'text-gray-900',
                                                                  !notification.isRead && 'font-semibold',
                                                              ),
                                                    )}
                                                >
                                                    {notification.title}
                                                </p>
                                                <p
                                                    className={cn(
                                                        'mt-0.5 text-xs line-clamp-2',
                                                        isAdmin ? 'text-slate-400' : 'text-gray-500',
                                                    )}
                                                >
                                                    {notification.body}
                                                </p>
                                                <p
                                                    className={cn(
                                                        'mt-1 text-[10px]',
                                                        isAdmin ? 'text-slate-500' : 'text-gray-400',
                                                    )}
                                                >
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
                                                    className={cn(
                                                        'shrink-0 self-center rounded-lg p-1.5 transition-colors',
                                                        isAdmin
                                                            ? 'text-slate-500 hover:bg-slate-700 hover:text-gymly-green-400'
                                                            : 'text-gray-400 hover:bg-gray-100 hover:text-green-600',
                                                    )}
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
                    <div className={cn('border-t px-4 py-3', isAdmin ? 'border-slate-700/50' : 'border-gray-100')}>
                        <Link
                            to={notificationsPageLink}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                'flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition-colors',
                                isAdmin
                                    ? 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 hover:text-white'
                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
                            )}
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
