import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { navigationItems, isNavItemActive } from '../lib/navigation';

const DesktopNavigation = () => {
    const location = useLocation();

    return (
        <div className="hidden gap-8 md:flex">
            {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isNavItemActive(item, location.pathname);

                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            'flex items-center gap-2 border-b-2 pt-4 pb-4 text-sm font-medium transition-colors',
                            isActive
                                ? 'border-white font-semibold text-white'
                                : 'border-transparent text-green-100 hover:text-white',
                        )}
                    >
                        <Icon className={cn('h-4 w-4')} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default DesktopNavigation;
