import { useQuery } from '@tanstack/react-query';
import { Loader2, Sparkles } from 'lucide-react';
import { getPackages } from '../../api/packages';
import { PackageCard } from '../../components/package-card';
import { cn } from '../../lib/utils';

export default function PackagesPage() {
    const {
        data: packages = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['packages'],
        queryFn: getPackages,
    });

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-center">
                    <p className="text-red-600 font-medium">
                        {error instanceof Error ? error.message : 'Failed to load packages'}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 text-sm text-red-500 hover:text-red-600 underline"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (packages.length === 0) {
        return (
            <div className="p-6 max-w-4xl mx-auto">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages available</h3>
                    <p className="text-gray-500">Check back later for membership options.</p>
                </div>
            </div>
        );
    }

    const getPopularIndex = (length: number): number => {
        if (length < 2) return -1;
        if (length === 2) return 1;
        return Math.floor(length / 2);
    };

    const popularIndex = getPopularIndex(packages.length);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="text-center my-10">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Choose Your Membership</h2>
                <p className="text-gray-500 max-w-xl mx-auto">
                    Select the perfect plan for your fitness journey. All memberships include full gym access and more.
                </p>
            </div>

            <div
                className={cn(
                    'grid gap-6',
                    packages.length === 1 && 'max-w-md mx-auto',
                    packages.length === 2 && 'md:grid-cols-2 max-w-3xl mx-auto',
                    packages.length === 3 && 'md:grid-cols-2 lg:grid-cols-3',
                    packages.length === 4 && 'md:grid-cols-2 lg:grid-cols-4',
                    packages.length >= 5 && 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
                )}
            >
                {packages.map((pkg, index) => (
                    <PackageCard key={pkg.id} pkg={pkg} isPopular={index === popularIndex} index={index} />
                ))}
            </div>

            <p className="text-center text-sm text-gray-400 mt-8">
                All prices are in USD. Subscriptions are non-refundable.
            </p>
        </div>
    );
}
