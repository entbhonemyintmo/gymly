import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Filter, Bell, CheckCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications';
import { Pagination } from '../../components/pagination';
import { NotificationCard, type NotificationVariant } from '../../components/notification-card';

type FilterValue = 'all' | 'unread' | 'read';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
];

interface NotificationsPageProps {
    variant?: NotificationVariant;
}

export default function NotificationsPage({ variant = 'user' }: NotificationsPageProps) {
    const [filter, setFilter] = useState<FilterValue>('all');
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const isAdmin = variant === 'admin';

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['notifications', filter, page],
        queryFn: () =>
            getNotifications({
                isRead: filter === 'all' ? undefined : filter === 'read',
                page,
                limit: 10,
            }),
    });

    const markAsReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['notificationsDropdown'] });
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['notificationsUnreadCount'] });
            queryClient.invalidateQueries({ queryKey: ['notificationsDropdown'] });
        },
    });

    const handleFilterChange = (value: FilterValue) => {
        setFilter(value);
        setPage(1);
    };

    const handleMarkAsRead = (id: number) => {
        markAsReadMutation.mutate([id]);
    };

    const handleMarkAllAsRead = () => {
        markAllAsReadMutation.mutate();
    };

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 text-gymly-green-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className={cn('max-w-4xl mx-auto', !isAdmin && 'p-6')}>
                <div
                    className={cn(
                        'rounded-2xl border p-6 text-center',
                        isAdmin ? 'bg-red-500/10 border-red-500/20' : 'bg-red-50 border-red-100',
                    )}
                >
                    <p className={cn('font-medium', isAdmin ? 'text-red-400' : 'text-red-600')}>
                        {error instanceof Error ? error.message : 'Failed to load notifications'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className={cn(
                            'mt-4 text-sm underline',
                            isAdmin ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-600',
                        )}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const notifications = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const total = data?.total ?? 0;
    const unreadCount = data?.unreadCount ?? 0;

    return (
        <div className={cn('mx-auto max-w-4xl', !isAdmin && 'p-6')}>
            {/* Header with filters and mark all read */}
            <div
                className={cn(
                    'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
                    isAdmin ? 'mb-8' : 'my-10',
                )}
            >
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div
                        className={cn('flex items-center gap-2 text-sm', isAdmin ? 'text-slate-400' : 'text-gray-500')}
                    >
                        <Filter className="h-4 w-4" />
                        <span>Filter:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {FILTER_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleFilterChange(option.value)}
                                className={cn(
                                    'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                                    filter === option.value
                                        ? isAdmin
                                            ? 'bg-gymly-green-500 text-white shadow-lg shadow-gymly-green-500/20'
                                            : 'bg-green-600 text-white shadow-sm'
                                        : isAdmin
                                          ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                                )}
                            >
                                {option.label}
                                {option.value === 'unread' && unreadCount > 0 && (
                                    <span className="ml-1.5 rounded-full bg-white/20 px-1.5 text-xs">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mark all as read button */}
                {unreadCount > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        disabled={markAllAsReadMutation.isPending}
                        className={cn(
                            'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50',
                            isAdmin
                                ? 'bg-gymly-green-500/10 text-gymly-green-400 hover:bg-gymly-green-500/20'
                                : 'bg-green-50 text-green-700 hover:bg-green-100',
                        )}
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Content */}
            {notifications.length === 0 ? (
                <div
                    className={cn(
                        'rounded-2xl border p-12 text-center',
                        isAdmin ? 'border-slate-800 bg-slate-900/50' : 'border-gray-100 bg-gray-50',
                    )}
                >
                    <div
                        className={cn(
                            'mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full',
                            isAdmin ? 'bg-slate-800' : 'bg-gray-100',
                        )}
                    >
                        <Bell className={cn('h-8 w-8', isAdmin ? 'text-slate-500' : 'text-gray-400')} />
                    </div>
                    <h3 className={cn('mb-2 text-lg font-semibold', isAdmin ? 'text-white' : 'text-gray-900')}>
                        {filter === 'all'
                            ? 'No notifications yet'
                            : filter === 'unread'
                              ? 'All caught up!'
                              : 'No read notifications'}
                    </h3>
                    <p className={isAdmin ? 'text-slate-400' : 'text-gray-500'}>
                        {filter === 'all'
                            ? "You'll see notifications here when there's activity."
                            : filter === 'unread'
                              ? "You don't have any unread notifications."
                              : "You haven't read any notifications yet."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {notifications.map((notification, index) => (
                            <NotificationCard
                                key={notification.id}
                                notification={notification}
                                index={index}
                                onMarkAsRead={handleMarkAsRead}
                                variant={variant}
                            />
                        ))}
                    </div>
                    <div className={isAdmin ? 'mt-8' : ''}>
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            total={total}
                            limit={10}
                            itemLabel="notifications"
                            onPageChange={setPage}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
