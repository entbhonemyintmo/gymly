import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    itemLabel?: string;
    onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, limit, itemLabel = 'items', onPageChange }: PaginationProps) {
    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push('ellipsis');
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push('ellipsis');
            pages.push(totalPages);
        }
        return pages;
    };

    return (
        <div className="mt-8 flex flex-col items-center gap-4">
            {/* Page info */}
            <p className="text-sm text-gray-500">
                Showing <span className="font-medium text-gray-700">{startItem}</span> to{' '}
                <span className="font-medium text-gray-700">{endItem}</span> of{' '}
                <span className="font-medium text-gray-700">{total}</span> {itemLabel}
            </p>

            {/* Pagination controls */}
            {totalPages > 1 && (
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>

                    {getPageNumbers().map((pageNum, idx) =>
                        pageNum === 'ellipsis' ? (
                            <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                                …
                            </span>
                        ) : (
                            <button
                                key={pageNum}
                                onClick={() => onPageChange(pageNum)}
                                className={cn(
                                    'inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                                    page === pageNum
                                        ? 'bg-green-600 text-white shadow-sm'
                                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
                                )}
                            >
                                {pageNum}
                            </button>
                        ),
                    )}

                    <button
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
