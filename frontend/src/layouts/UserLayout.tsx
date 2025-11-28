import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { Dumbbell } from 'lucide-react';
import DesktopNavigation from '../components/desktop-navigation';
import MobileNavigation from '../components/mobile-navigation';
import { useAuth } from '../context/AuthContext';
import { getNavItemByPath } from '../lib/navigation';

export default function UserLayout() {
    const location = useLocation();
    const { user } = useAuth();

    const currentPage = useMemo(() => {
        return getNavItemByPath(location.pathname);
    }, [location.pathname]);

    const Icon = currentPage.icon;

    return (
        <div className="min-h-screen w-full flex flex-col bg-grey-100">
            {/* Header with background image */}
            <header
                className="sticky top-0 left-0 right-0 z-20 px-4 pt-5 pb-10 md:px-6 md:pt-6 md:pb-12 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url('/background.jpg')`,
                }}
            >
                <div className="mx-auto max-w-7xl">
                    {/* Top bar with logo and user info */}
                    <div className="flex items-center justify-between mb-5 md:mb-6">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                                <Dumbbell className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white tracking-tight">Gymly</span>
                        </div>
                        {user && (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-white truncate max-w-[180px]">
                                        {user.email}
                                    </p>
                                    <p className="text-xs text-green-100 capitalize">{user.role}</p>
                                </div>
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm ring-2 ring-white/30">
                                    <span className="text-sm font-semibold text-white">
                                        {user.email.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Page title and description */}
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shadow-lg shadow-black/5 md:h-14 md:w-14">
                            <Icon className="h-6 w-6 text-white md:h-7 md:w-7" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold text-white md:text-3xl tracking-tight">
                                {currentPage.title}
                            </h1>
                            <p className="mt-1 text-sm text-green-100 md:text-base line-clamp-1">
                                {currentPage.description}
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <DesktopNavigation />
                </div>
            </header>

            {/* Main content area with subtle pattern */}
            <main
                className="flex-1 relative -mt-4 md:-mt-6 pb-20 md:pb-6"
                style={{
                    backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.3) 2px, transparent 2px)`,
                    backgroundSize: '20px 20px',
                }}
            >
                {/* Content card wrapper */}
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="min-h-[calc(100vh-16rem)] rounded-t-3xl shadow-xl shadow-green-100/50 md:rounded-3xl">
                        <Outlet />
                    </div>
                </div>
            </main>

            {/* Mobile Navigation */}
            <MobileNavigation />
        </div>
    );
}
