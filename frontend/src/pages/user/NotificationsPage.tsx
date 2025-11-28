import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Filter, Bell, CheckCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getNotifications, markAsRead, markAllAsRead } from '../../api/notifications';
import { Pagination } from '../../components/pagination';
import { NotificationCard } from '../../components/notification-card';

type FilterValue = 'all' | 'unread' | 'read';

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'unread', label: 'Unread' },
    { value: 'read', label: 'Read' },
];

export default function NotificationsPage() {
    const [filter, setFilter] = useState<FilterValue>('all');
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

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
                <Loader2 className="h-8 w-8 text-green-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
                    <p className="font-medium text-red-600">
                        {error instanceof Error ? error.message : 'Failed to load notifications'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 text-sm text-red-500 underline hover:text-red-600"
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
        <div className="mx-auto max-w-4xl p-6">
            {/* Header with filters and mark all read */}
            <div className="my-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
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
                                        ? 'bg-green-600 text-white shadow-sm'
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
                        className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50"
                    >
                        <CheckCheck className="h-4 w-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Content */}
            {notifications.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {filter === 'all'
                            ? 'No notifications yet'
                            : filter === 'unread'
                              ? 'All caught up!'
                              : 'No read notifications'}
                    </h3>
                    <p className="text-gray-500">
                        {filter === 'all'
                            ? "You'll see notifications here when there's activity on your account."
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
                            />
                        ))}
                    </div>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        limit={10}
                        itemLabel="notifications"
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
