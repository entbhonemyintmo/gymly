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

interface AdminSubscriptionRowProps {
    subscription: SubscriptionWithMember;
    isActionLoading: boolean;
    onApprove: (id: number) => void;
    onDeny: (id: number) => void;
}

export function AdminSubscriptionRow({ subscription, isActionLoading, onApprove, onDeny }: AdminSubscriptionRowProps) {
    const { member, order } = subscription;
    const status = STATUS_CONFIG[order.orderStatus];
    const StatusIcon = status.icon;

    return (
        <tr className="hover:bg-slate-800/30 transition-colors">
            {/* Member */}
            <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700/50">
                        <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {member.phoneNumber}
                        </p>
                    </div>
                </div>
            </td>

            {/* Package */}
            <td className="px-5 py-4">
                <div>
                    <p className="font-medium text-white flex items-center gap-1.5">
                        <Package className="h-4 w-4 text-gymly-green-500" />
                        {order.packageName}
                    </p>
                    <p className="text-xs text-slate-400">
                        {formatDuration(order.packageDurationDays)} • {formatPrice(order.packagePrice)}
                    </p>
                </div>
            </td>

            {/* Payment */}
            <td className="px-5 py-4">
                <div>
                    <p className="font-medium text-white">{formatPrice(order.paidAmount)}</p>
                    {order.receiptUrl && (
                        <a
                            href={order.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gymly-green-500 hover:text-gymly-green-400 flex items-center gap-1"
                        >
                            <Receipt className="h-3 w-3" />
                            View Receipt
                        </a>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="px-5 py-4">
                <span
                    className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border',
                        status.bgClass,
                        status.className,
                    )}
                >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {status.label}
                </span>
                {order.orderStatus === 'rejected' && order.reason && (
                    <p className="text-xs text-slate-500 mt-1 max-w-[150px] truncate" title={order.reason}>
                        {order.reason}
                    </p>
                )}
            </td>

            {/* Date */}
            <td className="px-5 py-4">
                <p className="text-sm text-slate-300 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    {formatDate(order.createdAt)}
                </p>
            </td>

            {/* Actions */}
            <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-2">
                    {order.orderStatus === 'pending' && (
                        <>
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
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
