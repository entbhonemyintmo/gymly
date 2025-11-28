import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreditCard, CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import { getSubscriptions, approveSubscription, denySubscription, type OrderStatus } from '../../api/subscriptions';
import { AdminSubscriptionRow } from '../../components/admin-subscription-row';
import { AdminSubscriptionCard } from '../../components/admin-subscription-card';
import { DenySubscriptionModal } from '../../components/deny-subscription-modal';
import { cn } from '../../lib/utils';

type FilterStatus = OrderStatus | 'all';

export default function AdminSubscriptionsPage() {
    const [filter, setFilter] = useState<FilterStatus>('all');
    const [page, setPage] = useState(1);
    const [denyModalId, setDenyModalId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    const {
        data: subscriptions,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['admin-subscriptions', filter, page],
        queryFn: () =>
            getSubscriptions({
                orderStatus: filter === 'all' ? undefined : filter,
                page,
                limit: 10,
            }),
    });

    const approveMutation = useMutation({
        mutationFn: approveSubscription,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
        },
    });

    const denyMutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) => denySubscription(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
            setDenyModalId(null);
        },
    });

    const handleFilterChange = (newFilter: FilterStatus) => {
        setFilter(newFilter);
        setPage(1);
    };

    const handleApprove = (subscriptionId: number) => {
        approveMutation.mutate(subscriptionId);
    };

    const handleDenyConfirm = (reason?: string) => {
        if (denyModalId !== null) {
            denyMutation.mutate({ id: denyModalId, reason });
        }
    };

    // Calculate stats from current page data
    const stats = {
        pending: subscriptions?.data.filter((s) => s.order.orderStatus === 'pending').length ?? 0,
        approved: subscriptions?.data.filter((s) => s.order.orderStatus === 'approved').length ?? 0,
        rejected: subscriptions?.data.filter((s) => s.order.orderStatus === 'rejected').length ?? 0,
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-linear-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{isLoading ? '-' : stats.pending}</p>
                            <p className="text-sm text-amber-400/80">Pending Approval</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-linear-to-br from-gymly-green-500/10 to-gymly-emerald-600/5 border border-gymly-green-500/20">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gymly-green-500/20 text-gymly-green-500">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{isLoading ? '-' : stats.approved}</p>
                            <p className="text-sm text-gymly-green-500/80">Approved</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-linear-to-br from-red-500/10 to-red-600/5 border border-red-500/20">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
                            <XCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{isLoading ? '-' : stats.rejected}</p>
                            <p className="text-sm text-red-400/80">Rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscriptions List */}
            <div className="rounded-2xl bg-linear-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gymly-green-500" />
                        All Subscriptions
                        {subscriptions && (
                            <span className="text-sm font-normal text-slate-400">({subscriptions.total})</span>
                        )}
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        {(['all', 'pending', 'approved', 'rejected'] as FilterStatus[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => handleFilterChange(status)}
                                className={cn(
                                    'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors',
                                    filter === status
                                        ? status === 'pending'
                                            ? 'bg-amber-500/20 text-amber-400'
                                            : status === 'approved'
                                              ? 'bg-gymly-green-500/20 text-gymly-green-500'
                                              : status === 'rejected'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-slate-700/50 text-white'
                                        : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50',
                                )}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {isLoading ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <Loader2 className="h-8 w-8 text-gymly-green-500 animate-spin mb-4" />
                        <p className="text-sm text-slate-400">Loading subscriptions...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 mb-4">
                            <AlertCircle className="h-8 w-8 text-red-400" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">Error loading data</h3>
                        <p className="text-sm text-slate-400 max-w-md mb-4">
                            {error instanceof Error ? error.message : 'Failed to fetch subscriptions'}
                        </p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-gymly-green-500 text-white hover:bg-gymly-green-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : subscriptions && subscriptions.data.length === 0 ? (
                    <div className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 mb-4">
                            <CreditCard className="h-8 w-8 text-slate-500" />
                        </div>
                        <h3 className="text-lg font-medium text-white mb-2">No subscriptions found</h3>
                        <p className="text-sm text-slate-400 max-w-md">
                            {filter === 'all' ? 'No subscription requests yet.' : `No ${filter} subscriptions.`}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards View */}
                        <div className="lg:hidden p-4 space-y-3">
                            {subscriptions?.data.map((subscription) => (
                                <AdminSubscriptionCard
                                    key={subscription.id}
                                    subscription={subscription}
                                    isActionLoading={
                                        approveMutation.isPending && approveMutation.variables === subscription.id
                                    }
                                    onApprove={handleApprove}
                                    onDeny={(id) => setDenyModalId(id)}
                                />
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700/50">
                                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Member
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Package
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-5 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/30">
                                    {subscriptions?.data.map((subscription) => (
                                        <AdminSubscriptionRow
                                            key={subscription.id}
                                            subscription={subscription}
                                            isActionLoading={
                                                approveMutation.isPending &&
                                                approveMutation.variables === subscription.id
                                            }
                                            onApprove={handleApprove}
                                            onDeny={(id) => setDenyModalId(id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {subscriptions && subscriptions.totalPages > 1 && (
                            <div className="px-4 lg:px-5 py-4 border-t border-slate-700/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <p className="text-sm text-slate-400">
                                    Page {subscriptions.page} of {subscriptions.totalPages}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage((p) => Math.min(subscriptions.totalPages, p + 1))}
                                        disabled={page === subscriptions.totalPages}
                                        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Deny Modal */}
            <DenySubscriptionModal
                isOpen={denyModalId !== null}
                isLoading={denyMutation.isPending}
                onConfirm={handleDenyConfirm}
                onCancel={() => setDenyModalId(null)}
            />
        </div>
    );
}
