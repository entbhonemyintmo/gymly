import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, LogOut, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { isAdminNavItemActive, filterNavItemsByRole } from '../lib/admin-navigation';
import { useAuth } from '../context/AuthContext';
import { useAdminSidebar } from '../context/AdminSidebarContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen } = useAdminSidebar();

    const filteredNavItems = user ? filterNavItemsByRole(user.role) : [];

    const handleNavClick = () => {
        setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 z-50 h-screen bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 transition-all duration-300 flex flex-col',
                    // Mobile: hidden by default, shown when isMobileOpen
                    'lg:translate-x-0',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full',
                    // Desktop: collapsed or expanded
                    isCollapsed ? 'lg:w-20' : 'lg:w-64',
                    'w-72', // Mobile width
                )}
            >
                {/* Logo Section */}
                <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-gymly-green-500 to-gymly-emerald-600 shadow-lg shadow-gymly-green-500/20">
                            <Dumbbell className="h-5 w-5 text-white" />
                        </div>
                        {(!isCollapsed || isMobileOpen) && (
                            <div className="overflow-hidden">
                                <h1 className="text-xl font-bold text-white tracking-tight">Gymly</h1>
                                {/* <p className="text-xs text-slate-400 font-medium">Admin Panel</p> */}
                            </div>
                        )}
                    </div>
                    {/* Mobile close button */}
                    <button
                        onClick={() => setIsMobileOpen(false)}
                        className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = isAdminNavItemActive(item, location.pathname);

                        return (
                            <Link
                                key={item.href}
                                to={item.href}
                                onClick={handleNavClick}
                                className={cn(
                                    'group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-linear-to-r from-gymly-green-500/20 to-gymly-emerald-600/10 text-gymly-green-500 shadow-lg shadow-gymly-green-500/5'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                                )}
                                title={isCollapsed && !isMobileOpen ? item.title : undefined}
                            >
                                <div
                                    className={cn(
                                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                                        isActive
                                            ? 'bg-gymly-green-500/20 text-gymly-green-500'
                                            : 'bg-slate-800/50 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-white',
                                    )}
                                >
                                    <Icon className="h-5 w-5" />
                                </div>
                                {(!isCollapsed || isMobileOpen) && (
                                    <div className="overflow-hidden">
                                        <span className="block truncate">{item.title}</span>
                                        <span
                                            className={cn(
                                                'block text-xs truncate transition-colors',
                                                isActive ? 'text-gymly-green-500/70' : 'text-slate-500',
                                            )}
                                        >
                                            {item.description}
                                        </span>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Section */}
                <div className="border-t border-slate-800/50 p-4">
                    {user && (!isCollapsed || isMobileOpen) && (
                        <div className="flex items-center gap-3 mb-3 px-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-800 ring-2 ring-slate-700/50">
                                <span className="text-sm font-semibold text-white">
                                    {user.email.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                                <p className="text-xs text-gymly-green-500 capitalize font-medium">{user.role}</p>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={logout}
                        className={cn(
                            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-gymly-green-500 hover:bg-gymly-green-500/10 transition-all duration-200',
                            isCollapsed && !isMobileOpen && 'justify-center',
                        )}
                        title={isCollapsed && !isMobileOpen ? 'Logout' : undefined}
                    >
                        <LogOut className="h-5 w-5 shrink-0" />
                        {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
                    </button>
                </div>

                {/* Collapse Toggle - Desktop only */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-lg"
                >
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </aside>
        </>
    );
};

export default AdminSidebar;
