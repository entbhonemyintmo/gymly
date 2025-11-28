import { User, Phone, Calendar, Receipt, Package, Loader2, Check, X, CheckCircle, XCircle, Clock } from 'lucide-react';
import { type SubscriptionWithMember, type OrderStatus } from '../api/subscriptions';
import { cn, formatDate, formatPrice, formatDuration } from '../lib/utils';

const STATUS_CONFIG: Record<
    OrderStatus,
    { label: string; icon: typeof CheckCircle; className: string; bgClass: string }
> = {
    pending: {
        label: 'Pending',
        icon: Clock,
        className: 'text-amber-400',
        bgClass: 'bg-amber-500/10 border-amber-500/30',
    },
    approved: {
        label: 'Approved',
        icon: CheckCircle,
        className: 'text-gymly-green-500',
        bgClass: 'bg-gymly-green-500/10 border-gymly-green-500/30',
    },
    rejected: {
        label: 'Rejected',
        icon: XCircle,
        className: 'text-red-400',
        bgClass: 'bg-red-500/10 border-red-500/30',
    },
};

interface AdminSubscriptionCardProps {
    subscription: SubscriptionWithMember;
    isActionLoading: boolean;
    onApprove: (id: number) => void;
    onDeny: (id: number) => void;
}

export function AdminSubscriptionCard({
    subscription,
    isActionLoading,
    onApprove,
    onDeny,
}: AdminSubscriptionCardProps) {
    const { member, order } = subscription;
    const status = STATUS_CONFIG[order.orderStatus];
    const StatusIcon = status.icon;

    return (
        <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 space-y-4">
            {/* Header: Member + Status */}
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/50 shrink-0">
                        <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-white truncate">{member.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phoneNumber}
                        </p>
                    </div>
                </div>
                <span
                    className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border shrink-0',
                        status.bgClass,
                        status.className,
                    )}
                >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                </span>
            </div>

            {/* Package Info */}
            <div className="flex items-center gap-2 text-sm">
                <Package className="h-4 w-4 text-gymly-green-500 shrink-0" />
                <span className="text-white font-medium">{order.packageName}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{formatDuration(order.packageDurationDays)}</span>
            </div>

            {/* Payment + Date Row */}
            <div className="flex items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-4">
                    <div>
                        <p className="text-slate-500 text-xs">Package Price</p>
                        <p className="text-white font-medium">{formatPrice(order.packagePrice)}</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs">Paid</p>
                        <p className="text-white font-medium">{formatPrice(order.paidAmount)}</p>
                    </div>
                </div>
                {order.receiptUrl && (
                    <a
                        href={order.receiptUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gymly-green-500 hover:text-gymly-green-400 flex items-center gap-1"
                    >
                        <Receipt className="h-3 w-3" />
                        Receipt
                    </a>
                )}
            </div>

            {/* Rejection Reason */}
            {order.orderStatus === 'rejected' && order.reason && (
                <p className="text-xs text-red-400/80 bg-red-500/10 px-3 py-2 rounded-lg">Reason: {order.reason}</p>
            )}

            {/* Footer: Date + Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.createdAt)}
                </p>

                {order.orderStatus === 'pending' && (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onApprove(subscription.id)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gymly-green-500/10 text-gymly-green-500 hover:bg-gymly-green-500/20 transition-colors disabled:opacity-50"
                        >
                            {isActionLoading ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Check className="h-3.5 w-3.5" />
                            )}
                            Approve
                        </button>
                        <button
                            onClick={() => onDeny(subscription.id)}
                            disabled={isActionLoading}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                        >
                            <X className="h-3.5 w-3.5" />
                            Deny
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
