import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import {
    X,
    CreditCard,
    Receipt,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Clock,
    Sparkles,
    Upload,
    ImageIcon,
    Trash2,
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { type Package } from '../api/packages';
import { subscribe, type SubscribeResponse } from '../api/subscriptions';
import { cn, formatPrice, formatDuration } from '../lib/utils';

interface SubscribeModalProps {
    pkg: Package | null;
    isOpen: boolean;
    onClose: () => void;
}

export function SubscribeModal({ pkg, isOpen, onClose }: SubscribeModalProps) {
    const [paidAmount, setPaidAmount] = useState('');
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState<SubscribeResponse | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { mutate, isPending, error, reset } = useMutation({
        mutationFn: subscribe,
        onSuccess: (data) => {
            setSuccessData(data);
            setShowSuccess(true);
        },
    });

    // Reset form when modal opens with new package
    useEffect(() => {
        if (pkg && isOpen) {
            setPaidAmount(String(pkg.price));
            setReceiptFile(null);
            setReceiptPreview(null);
            setShowSuccess(false);
            setSuccessData(null);
            reset();
        }
    }, [pkg, isOpen, reset]);

    // Generate preview URL for image files
    useEffect(() => {
        if (!receiptFile) {
            setReceiptPreview(null);
            return;
        }

        if (receiptFile.type.startsWith('image/')) {
            const url = URL.createObjectURL(receiptFile);
            setReceiptPreview(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [receiptFile]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setReceiptFile(file);
        }
    };

    const handleRemoveFile = () => {
        setReceiptFile(null);
        setReceiptPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!pkg) return;

        const amount = parseInt(paidAmount, 10);
        if (isNaN(amount) || amount <= 0) return;

        // TODO: When backend supports file upload, send receiptFile here
        // For now, we just submit without the receipt file
        mutate({
            packageId: pkg.id,
            paidAmount: amount,
            // receiptFile will be handled when backend is updated
        });
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen || !pkg) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" />

            {/* Modal */}
            <div
                ref={modalRef}
                className={cn(
                    'relative w-full max-w-md bg-white rounded-3xl shadow-2xl',
                    'animate-scale-in overflow-hidden',
                )}
                style={{
                    animation: 'scale-in 0.2s ease-out',
                }}
            >
                {/* Header gradient */}
                <div className="h-2 bg-linear-to-r from-green-500 to-emerald-500" />

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                    aria-label="Close"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {showSuccess && successData ? (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Subscription Submitted!</h2>
                        <p className="text-gray-500 mb-6">
                            Your subscription request for{' '}
                            <span className="font-semibold text-gray-700">{pkg.name}</span> has been submitted
                            successfully.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                            <div className="flex items-center gap-2 text-amber-700 mb-1">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Pending Approval</span>
                            </div>
                            <p className="text-sm text-amber-600">
                                Your subscription is awaiting admin approval. You'll be notified once it's approved.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Order ID</span>
                                <span className="font-mono font-medium text-gray-900">#{successData.order.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Amount Paid</span>
                                <span className="font-medium text-gray-900">
                                    {formatPrice(successData.order.paidAmount)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Duration</span>
                                <span className="font-medium text-gray-900">
                                    {formatDuration(successData.order.packageDurationDays)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3.5 px-4 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    /* Form State */
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="text-center mb-6">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-200/50">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Subscribe to Package</h2>
                            <p className="text-sm text-gray-500 mt-1">Complete your subscription</p>
                        </div>

                        {/* Package Summary */}
                        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-4 mb-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                                    <p className="text-sm text-gray-500">{formatDuration(pkg.durationDays)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">{formatPrice(pkg.price)}</p>
                                </div>
                            </div>
                            {pkg.description && (
                                <p className="text-sm text-gray-500 mt-2 line-clamp-2">{pkg.description}</p>
                            )}
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-800">Subscription Failed</p>
                                    <p className="text-sm text-red-600 mt-0.5">
                                        {error instanceof Error
                                            ? error.message
                                            : 'Something went wrong. Please try again.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Paid Amount Input */}
                        <div className="mb-4">
                            <label htmlFor="paidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                    Amount Paid (MMK)
                                </span>
                            </label>
                            <input
                                type="number"
                                id="paidAmount"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                placeholder="Enter amount paid"
                                min="1"
                                required
                                className={cn(
                                    'w-full px-4 py-3 rounded-xl border-2 border-gray-200',
                                    'focus:border-green-500 focus:ring-0 outline-none transition-colors',
                                    'text-gray-900 placeholder:text-gray-400',
                                    'bg-white',
                                )}
                            />
                            {parseInt(paidAmount) !== pkg.price && parseInt(paidAmount) > 0 && (
                                <p className="text-xs text-amber-600 mt-1.5">
                                    Note: Amount differs from package price ({formatPrice(pkg.price)})
                                </p>
                            )}
                        </div>

                        {/* Receipt File Input */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <span className="flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-gray-400" />
                                    Payment Receipt
                                    <span className="text-gray-400 font-normal">(Optional)</span>
                                </span>
                            </label>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleFileChange}
                                className="hidden"
                                id="receiptFile"
                            />

                            {receiptFile ? (
                                <div className="relative rounded-xl border-2 border-green-200 bg-green-50/50 p-3">
                                    <div className="flex items-center gap-3">
                                        {receiptPreview ? (
                                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                                                <img
                                                    src={receiptPreview}
                                                    alt="Receipt preview"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                                                <ImageIcon className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {receiptFile.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {(receiptFile.size / 1024).toFixed(1)} KB
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                                            aria-label="Remove file"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        'w-full rounded-xl border-2 border-dashed border-gray-300 p-6',
                                        'hover:border-green-400 hover:bg-green-50/50 transition-all',
                                        'flex flex-col items-center justify-center gap-2',
                                    )}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                        <Upload className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-700">Click to upload receipt</p>
                                        <p className="text-xs text-gray-400 mt-0.5">PNG, JPG or PDF up to 10MB</p>
                                    </div>
                                </button>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isPending || !paidAmount || parseInt(paidAmount) <= 0}
                            className={cn(
                                'w-full py-3.5 px-4 rounded-xl font-semibold transition-all duration-200',
                                'flex items-center justify-center gap-2',
                                'bg-green-600 text-white shadow-lg shadow-green-200/50',
                                'hover:bg-green-700 hover:shadow-xl hover:shadow-green-200/60',
                                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 disabled:hover:shadow-lg',
                            )}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>Confirm Subscription</>
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            By subscribing, you agree to our terms of service. Subscriptions require admin approval.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
