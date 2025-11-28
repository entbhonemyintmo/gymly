import { Users, CalendarCheck, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminHomePage() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="rounded-2xl bg-linear-to-br from-gymly-green-500/10 via-slate-800/30 to-slate-900/30 border border-gymly-green-500/20 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
                <p className="text-slate-400">Here's what's happening at your gym today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">-</p>
                            <p className="text-sm text-slate-400">Total Members</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gymly-green-500/10 text-gymly-green-500">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">-</p>
                            <p className="text-sm text-slate-400">Today's Check-ins</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">-</p>
                            <p className="text-sm text-slate-400">Pending Subscriptions</p>
                        </div>
                    </div>
                </div>

                <div className="p-5 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gymly-emerald-500/10 text-gymly-emerald-500">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">-</p>
                            <p className="text-sm text-slate-400">Active Subscriptions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-linear-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white">Recent Check-ins</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/50 mb-3">
                            <CalendarCheck className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-400">Recent check-ins will appear here</p>
                    </div>
                </div>

                <div className="rounded-2xl bg-linear-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-700/50">
                        <h3 className="text-lg font-semibold text-white">Pending Approvals</h3>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-800/50 mb-3">
                            <CreditCard className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-sm text-slate-400">Pending subscription requests will appear here</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
