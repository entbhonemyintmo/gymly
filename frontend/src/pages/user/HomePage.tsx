import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CreditCard, CalendarCheck } from 'lucide-react';
import { CheckInCard } from '../../components/checkin-card';

export default function UserHomePage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Quick Check-in Card */}
            <div className="my-10">
                <CheckInCard variant="compact" />
            </div>

            {/* Quick Links Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {/* Check-in History */}
                <Link
                    to="/my-checkins"
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-green-200 animate-fade-in"
                    style={{ animationDelay: '100ms' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                            <CalendarCheck className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-green-700">My Check-ins</h3>
                            <p className="text-sm text-gray-500">View your history</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-green-500" />
                    </div>
                </Link>

                {/* My Subscriptions */}
                <Link
                    to="/my-subscriptions"
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-green-200 animate-fade-in"
                    style={{ animationDelay: '150ms' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-700">
                                My Subscriptions
                            </h3>
                            <p className="text-sm text-gray-500">Manage your plans</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-emerald-500" />
                    </div>
                </Link>

                {/* Browse Packages */}
                <Link
                    to="/packages"
                    className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-green-200 animate-fade-in sm:col-span-2 lg:col-span-1"
                    style={{ animationDelay: '200ms' }}
                >
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600 transition-colors group-hover:bg-teal-600 group-hover:text-white">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 group-hover:text-teal-700">Browse Packages</h3>
                            <p className="text-sm text-gray-500">Find your perfect plan</p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-teal-500" />
                    </div>
                </Link>
            </div>

            {/* Welcome Card */}
            <div
                className="mt-6 rounded-2xl bg-linear-to-r from-gray-50 to-green-50 p-6 border border-green-100 animate-fade-in"
                style={{ animationDelay: '250ms' }}
            >
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Welcome to Gymly!</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                    Track your fitness journey, manage your subscriptions, and stay on top of your workouts. Use the
                    check-in feature above every time you visit the gym to keep a record of your progress.
                </p>
            </div>
        </div>
    );
}
