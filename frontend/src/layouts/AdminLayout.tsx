import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { Menu, Dumbbell } from 'lucide-react';
import AdminSidebar from '../components/admin-sidebar';
import { NotificationDropdown } from '../components/notification-dropdown';
import { getAdminNavItemByPath } from '../lib/admin-navigation';
import { AdminSidebarProvider, useAdminSidebar } from '../context/AdminSidebarContext';

function AdminLayoutContent() {
    const location = useLocation();
    const { isCollapsed, setIsMobileOpen } = useAdminSidebar();

    const currentPage = useMemo(() => {
        return getAdminNavItemByPath(location.pathname);
    }, [location.pathname]);

    const Icon = currentPage.icon;

    return (
        <div className="min-h-screen w-full flex bg-slate-950">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content - grows when sidebar collapses */}
            <div
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
                    isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
                }`}
            >
                {/* Header */}
                <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
                    <div className="px-4 py-4 md:px-8 md:py-6">
                        <div className="flex items-center gap-4">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileOpen(true)}
                                className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                <Menu className="h-5 w-5" />
                            </button>

                            {/* Logo - visible on mobile */}
                            <div className="flex lg:hidden items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-gymly-green-500 to-gymly-emerald-600">
                                    <Dumbbell className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-lg font-bold text-gymly-green-500 tracking-tight">
                                    Gymly Admin
                                </span>
                            </div>

                            {/* Page title - desktop */}
                            <div className="hidden lg:flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-gymly-green-500/20 to-gymly-emerald-600/10 shadow-lg shadow-gymly-green-500/5">
                                    <Icon className="h-6 w-6 text-gymly-green-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight">
                                        {currentPage.title}
                                    </h1>
                                    <p className="text-sm text-slate-400">{currentPage.description}</p>
                                </div>
                            </div>

                            {/* User info - right side */}
                            <div className="ml-auto flex items-center gap-3">
                                <NotificationDropdown variant="admin" notificationsPageLink="/admin/notifications" />
                            </div>
                        </div>

                        {/* Page title - mobile */}
                        <div className="lg:hidden mt-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-gymly-green-500/20 to-gymly-emerald-600/10">
                                <Icon className="h-5 w-5 text-gymly-green-500" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">{currentPage.title}</h1>
                                <p className="text-xs text-slate-400">{currentPage.description}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout() {
    return (
        <AdminSidebarProvider>
            <AdminLayoutContent />
        </AdminSidebarProvider>
    );
}
