import { Clock, Sparkles, Check, ArrowRight } from 'lucide-react';
import { type Package } from '../api/packages';
import { cn, formatPrice, formatDuration, getPackageFeatures } from '../lib/utils';

export interface PackageCardProps {
    pkg: Package;
    isPopular?: boolean;
    index: number;
    onSubscribe?: (pkg: Package) => void;
}

export function PackageCard({ pkg, isPopular, index, onSubscribe }: PackageCardProps) {
    const features = getPackageFeatures(pkg.durationDays);

    return (
        <div
            className={cn(
                'relative group rounded-3xl p-6 transition-all duration-300 hover:scale-[1.02]',
                isPopular
                    ? 'bg-linear-to-br from-green-600 to-emerald-700 text-white shadow-xl shadow-green-200/50'
                    : 'bg-white border border-gray-100 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-green-100/50 hover:border-green-100',
            )}
            style={{
                animationDelay: `${index * 100}ms`,
                animation: 'slide-up 0.5s ease-out backwards',
            }}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-1.5 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-lg shadow-amber-200/50">
                        <Sparkles className="w-3.5 h-3.5" />
                        Most Popular
                    </div>
                </div>
            )}

            <div
                className={cn(
                    'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium mb-4',
                    isPopular ? 'bg-white/20 text-white' : 'bg-green-50 text-green-700',
                )}
            >
                <Clock className="w-3.5 h-3.5" />
                {formatDuration(pkg.durationDays)}
            </div>

            <h3 className={cn('text-xl font-bold mb-2', isPopular ? 'text-white' : 'text-gray-900')}>{pkg.name}</h3>

            {pkg.description && (
                <p className={cn('text-sm mb-5 line-clamp-2', isPopular ? 'text-green-100' : 'text-gray-500')}>
                    {pkg.description}
                </p>
            )}

            <div className="mb-5">
                <div className="flex items-baseline gap-1">
                    <span
                        className={cn(
                            'text-4xl font-extrabold tracking-tight',
                            isPopular ? 'text-white' : 'text-gray-900',
                        )}
                    >
                        {formatPrice(pkg.price)}
                    </span>
                </div>
                <p className={cn('text-sm mt-1', isPopular ? 'text-green-100' : 'text-gray-400')}>
                    {pkg.durationDays >= 30
                        ? `${formatPrice(Math.round((pkg.price / pkg.durationDays) * 30))}/month`
                        : 'one-time payment'}
                </p>
            </div>

            <ul className="space-y-2.5 mb-6">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                        <div
                            className={cn(
                                'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                                isPopular ? 'bg-white/20' : 'bg-green-100',
                            )}
                        >
                            <Check className={cn('w-3 h-3', isPopular ? 'text-white' : 'text-green-600')} />
                        </div>
                        <span className={cn('text-sm', isPopular ? 'text-green-50' : 'text-gray-600')}>{feature}</span>
                    </li>
                ))}
            </ul>

            <button
                onClick={() => onSubscribe?.(pkg)}
                className={cn(
                    'w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-semibold transition-all duration-200',
                    isPopular
                        ? 'bg-white text-green-700 hover:bg-green-50 shadow-lg shadow-black/10'
                        : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-200/50',
                )}
            >
                Subscribe Now
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
}
