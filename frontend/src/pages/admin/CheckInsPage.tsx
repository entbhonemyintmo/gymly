import { CalendarCheck, UserPlus } from 'lucide-react';

export default function AdminCheckInsPage() {
    return (
        <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="flex items-center gap-4 p-5 rounded-2xl bg-linear-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-gymly-green-500/30 transition-all duration-200 group text-left">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gymly-green-500/10 text-gymly-green-500 group-hover:bg-gymly-green-500/20 transition-colors">
                        <UserPlus className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">Check In Member</h3>
                        <p className="text-xs text-slate-400">Manually check in a member</p>
                    </div>
                </button>
            </div>

            {/* Check-ins List Placeholder */}
            <div className="rounded-2xl bg-linear-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/50">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-gymly-green-500" />
                        All Check-ins
                    </h2>
                </div>
                <div className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/50 mb-4">
                        <CalendarCheck className="h-8 w-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Check-ins List</h3>
                    <p className="text-sm text-slate-400 max-w-md">
                        View all member check-ins here. This page will display a list of all check-ins with filtering
                        and pagination options.
                    </p>
                </div>
            </div>
        </div>
    );
}
