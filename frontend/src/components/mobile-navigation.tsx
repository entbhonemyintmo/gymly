import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { navigationItems, isNavItemActive } from '../lib/navigation';

const MobileNavigation = () => {
    const location = useLocation();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-lg md:hidden">
            <div className="flex h-16 items-center justify-around px-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isNavItemActive(item, location.pathname);

                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={cn(
                                'flex flex-1 flex-col items-center justify-center gap-1 py-2 transition-all duration-200',
                                isActive ? 'text-green-600' : 'text-gray-500 hover:text-gray-700',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-xl transition-all duration-200',
                                    isActive && 'bg-green-100 scale-110',
                                )}
                            >
                                <Icon
                                    className={cn('h-5 w-5 transition-all duration-200', isActive && 'stroke-[2.5px]')}
                                />
                            </div>
                            <span
                                className={cn(
                                    'text-[10px] font-medium transition-all duration-200',
                                    isActive && 'font-semibold',
                                )}
                            >
                                {item.title}
                            </span>
                        </Link>
                    );
                })}
            </div>

            <div className="h-[env(safe-area-inset-bottom)]" />
        </nav>
    );
};

export default MobileNavigation;
