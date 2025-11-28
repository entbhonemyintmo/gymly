import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Filter, Sparkles } from 'lucide-react';
import { getMySubscriptions, type OrderStatus } from '../../api/subscriptions';
import { SubscriptionCard } from '../../components/subscription-card';
import { Pagination } from '../../components/pagination';
import { cn } from '../../lib/utils';

const FILTER_OPTIONS: { value: OrderStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'approved', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
];

export default function MySubscriptionsPage() {
    const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
    const [page, setPage] = useState(1);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['mySubscriptions', statusFilter, page],
        queryFn: () =>
            getMySubscriptions({
                orderStatus: statusFilter === 'all' ? undefined : statusFilter,
                page,
                limit: 10,
            }),
    });

    const handleFilterChange = (value: OrderStatus | 'all') => {
        setStatusFilter(value);
        setPage(1);
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
                        {error instanceof Error ? error.message : 'Failed to load subscriptions'}
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

    const subscriptions = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const total = data?.total ?? 0;

    return (
        <div className="mx-auto max-w-4xl p-6">
            {/* Filters */}
            <div className="my-10 flex flex-wrap items-center gap-3">
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
                                statusFilter === option.value
                                    ? 'bg-green-600 text-white shadow-sm'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            {subscriptions.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Sparkles className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {statusFilter === 'all'
                            ? 'No subscriptions yet'
                            : `No ${FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label.toLowerCase()} subscriptions`}
                    </h3>
                    <p className="text-gray-500">
                        {statusFilter === 'all'
                            ? 'Subscribe to a package to get started with your fitness journey.'
                            : 'Try adjusting your filter to see more results.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-5">
                        {subscriptions.map((subscription, index) => (
                            <SubscriptionCard key={subscription.id} subscription={subscription} index={index} />
                        ))}
                    </div>
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        limit={10}
                        itemLabel="subscriptions"
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
