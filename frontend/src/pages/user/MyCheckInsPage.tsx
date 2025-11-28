import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Filter, CheckCircle2, XCircle, Clock, Sparkles, Calendar } from 'lucide-react';
import { getMyCheckIns, type CheckInStatus } from '../../api/checkins';
import { CheckInCard } from '../../components/checkin-card';
import { Pagination } from '../../components/pagination';
import { cn, formatDate } from '../../lib/utils';

const FILTER_OPTIONS: { value: CheckInStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'allowed', label: 'Allowed' },
    { value: 'denied', label: 'Denied' },
];

const STATUS_CONFIG: Record<
    CheckInStatus,
    { label: string; icon: typeof CheckCircle2; className: string; bgClass: string }
> = {
    allowed: {
        label: 'Allowed',
        icon: CheckCircle2,
        className: 'text-green-600',
        bgClass: 'bg-green-50 border-green-200',
    },
    denied: {
        label: 'Denied',
        icon: XCircle,
        className: 'text-red-600',
        bgClass: 'bg-red-50 border-red-200',
    },
};

export default function MyCheckInsPage() {
    const [statusFilter, setStatusFilter] = useState<CheckInStatus | 'all'>('all');
    const [page, setPage] = useState(1);

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['myCheckIns', statusFilter, page],
        queryFn: () =>
            getMyCheckIns({
                status: statusFilter === 'all' ? undefined : statusFilter,
                page,
                limit: 10,
            }),
    });

    const handleFilterChange = (value: CheckInStatus | 'all') => {
        setStatusFilter(value);
        setPage(1);
    };

    const formatTime = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        } catch {
            return '';
        }
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
                        {error instanceof Error ? error.message : 'Failed to load check-ins'}
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

    const checkIns = data?.data ?? [];
    const totalPages = data?.totalPages ?? 1;
    const total = data?.total ?? 0;

    return (
        <div className="mx-auto max-w-4xl p-6">
            {/* Check-in Card */}
            <div className="my-10">
                <CheckInCard variant="full" />
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
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

            {/* Check-in History */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Check-in History</h3>
                <p className="text-sm text-gray-500">View all your gym visits</p>
            </div>

            {checkIns.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        <Sparkles className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {statusFilter === 'all'
                            ? 'No check-ins yet'
                            : `No ${FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label.toLowerCase()} check-ins`}
                    </h3>
                    <p className="text-gray-500">
                        {statusFilter === 'all'
                            ? 'Start your fitness journey by checking in at the gym!'
                            : 'Try adjusting your filter to see more results.'}
                    </p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {checkIns.map((checkIn, index) => {
                            const status = STATUS_CONFIG[checkIn.status];
                            const StatusIcon = status.icon;

                            return (
                                <div
                                    key={checkIn.id}
                                    className={cn(
                                        'relative flex items-center gap-4 rounded-2xl border-[0.5px] border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md',
                                        'animate-fade-in',
                                    )}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Status Icon */}
                                    <div
                                        className={cn(
                                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                                            checkIn.status === 'allowed' ? 'bg-green-100' : 'bg-red-100',
                                        )}
                                    >
                                        <StatusIcon
                                            className={cn(
                                                'h-6 w-6',
                                                checkIn.status === 'allowed' ? 'text-green-600' : 'text-red-600',
                                            )}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={cn(
                                                    'text-sm font-semibold',
                                                    checkIn.status === 'allowed' ? 'text-green-700' : 'text-red-700',
                                                )}
                                            >
                                                {status.label}
                                            </span>
                                            {checkIn.reason && (
                                                <span className="text-xs text-gray-400">• {checkIn.reason}</span>
                                            )}
                                        </div>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {formatDate(checkIn.createdAt)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {formatTime(checkIn.createdAt)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Badge */}
                                    <div
                                        className={cn(
                                            'hidden sm:flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                                            status.bgClass,
                                            status.className,
                                        )}
                                    >
                                        <StatusIcon className="h-3 w-3" />
                                        {status.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        limit={10}
                        itemLabel="check-ins"
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
