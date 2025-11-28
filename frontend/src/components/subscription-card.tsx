import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Package, Receipt } from 'lucide-react';
import { type MySubscription, type OrderStatus } from '../api/subscriptions';
import { cn, formatDate, formatPrice, formatDuration } from '../lib/utils';

const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; icon: typeof CheckCircle2; className: string; bgClass: string }
> = {
    pending: {
        label: 'Pending Approval',
        icon: Clock,
        className: 'text-amber-600',
        bgClass: 'bg-amber-50 border-amber-200',
    },
    approved: {
        label: 'Active',
        icon: CheckCircle2,
        className: 'text-green-600',
        bgClass: 'bg-green-50 border-green-200',
    },
    rejected: {
        label: 'Rejected',
        icon: XCircle,
        className: 'text-red-600',
        bgClass: 'bg-red-50 border-red-200',
    },
};

interface SubscriptionCardProps {
    subscription: MySubscription;
    index: number;
}

export function SubscriptionCard({ subscription, index }: SubscriptionCardProps) {
    const { order } = subscription;
    const status = STATUS_CONFIG[order.orderStatus];
    const StatusIcon = status.icon;

    const isActive =
        order.orderStatus === 'approved' && subscription.endDate && new Date(subscription.endDate) > new Date();

    const daysRemaining =
        isActive && subscription.endDate
            ? Math.ceil((new Date(subscription.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : null;

    return (
        <div
            className={cn(
                'relative rounded-2xl border-[0.5px] border-gymly-emerald-500/50 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md',
                'animate-fade-in',
            )}
            style={{ animationDelay: `${index * 80}ms` }}
        >
            {/* Status Badge */}
            <div
                className={cn(
                    'absolute -top-3 right-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                    status.bgClass,
                    status.className,
                )}
            >
                <StatusIcon className="h-3.5 w-3.5" />
                {status.label}
            </div>

            {/* Package Info */}
            <div className="mb-4 mt-2">
                <h3 className="text-lg font-semibold text-gray-900">{order.packageName}</h3>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDuration(order.packageDurationDays)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Package className="h-3.5 w-3.5" />
                        {formatPrice(order.packagePrice)}
                    </span>
                </div>
            </div>

            {/* Timeline / Dates */}
            {order.orderStatus === 'approved' && subscription.startDate && subscription.endDate && (
                <div className="mb-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 p-4">
                    <div className="flex items-center justify-between text-sm">
                        <div>
                            <p className="text-xs font-medium text-gray-500">Started</p>
                            <p className="font-semibold text-gray-900">{formatDate(subscription.startDate)}</p>
                        </div>
                        <div className="mx-4 flex-1">
                            <div className="relative h-1.5 rounded-full bg-gray-200">
                                <div
                                    className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-green-500 to-emerald-500"
                                    style={{
                                        width: isActive
                                            ? `${Math.max(10, 100 - (daysRemaining! / order.packageDurationDays) * 100)}%`
                                            : '100%',
                                    }}
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-medium text-gray-500">Expires</p>
                            <p className="font-semibold text-gray-900">{formatDate(subscription.endDate)}</p>
                        </div>
                    </div>
                    {isActive && daysRemaining !== null && (
                        <p className="mt-2 text-center text-xs font-medium text-green-700">
                            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                        </p>
                    )}
                    {!isActive && order.orderStatus === 'approved' && (
                        <p className="mt-2 text-center text-xs font-medium text-gray-500">Subscription expired</p>
                    )}
                </div>
            )}

            {/* Pending Status Message */}
            {order.orderStatus === 'pending' && (
                <div className="mb-4 flex items-start gap-3 rounded-xl bg-amber-50 p-4">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <div>
                        <p className="text-sm font-medium text-amber-800">Awaiting admin approval</p>
                        <p className="mt-0.5 text-xs text-amber-600">
                            Your subscription request is being reviewed. We'll notify you once it's approved.
                        </p>
                    </div>
                </div>
            )}

            {/* Rejected Status Message */}
            {order.orderStatus === 'rejected' && (
                <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 p-4">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                    <div>
                        <p className="text-sm font-medium text-red-800">Subscription request denied</p>
                        {order.reason && <p className="mt-0.5 text-xs text-red-600">Reason: {order.reason}</p>}
                    </div>
                </div>
            )}

            {/* Payment Info */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="text-sm">
                    <span className="text-gray-500">Paid: </span>
                    <span className="font-semibold text-gray-900">{formatPrice(order.paidAmount)}</span>
                </div>
                <div className="flex items-center gap-2">
                    {order.receiptUrl && (
                        <a
                            href={order.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            <Receipt className="h-3.5 w-3.5" />
                            View Receipt
                        </a>
                    )}
                    <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                </div>
            </div>
        </div>
    );
}
