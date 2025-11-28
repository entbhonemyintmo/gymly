import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminSubscriptionsPage() {
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
                            <p className="text-2xl font-bold text-white">-</p>
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
                            <p className="text-2xl font-bold text-white">-</p>
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
                            <p className="text-2xl font-bold text-white">-</p>
                            <p className="text-sm text-red-400/80">Rejected</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscriptions List Placeholder */}
            <div className="rounded-2xl bg-linear-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-gymly-green-500" />
                        All Subscriptions
                    </h2>
                    <div className="flex items-center gap-2 flex-wrap">
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                            All
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                            Pending
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                            Approved
                        </button>
                        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
                            Rejected
                        </button>
                    </div>
                </div>
                <div className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 mb-4">
                        <CreditCard className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Subscriptions List</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                        Manage member subscriptions here. You can approve or deny pending subscription requests and view
                        all subscription history.
                    </p>
                </div>
            </div>
        </div>
    );
}
