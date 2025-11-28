import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Loader2, Fingerprint, CheckCircle2, XCircle, Shield } from 'lucide-react';
import { checkIn, type CheckInResponse } from '../api/checkins';
import { cn, formatDate } from '../lib/utils';

type CheckInResultState = {
    type: 'success' | 'denied';
    data: CheckInResponse;
} | null;

interface CheckInCardProps {
    variant?: 'full' | 'compact';
}

export function CheckInCard({ variant = 'full' }: CheckInCardProps) {
    const [checkInResult, setCheckInResult] = useState<CheckInResultState>(null);
    const queryClient = useQueryClient();

    const checkInMutation = useMutation({
        mutationFn: checkIn,
        onSuccess: (data) => {
            setCheckInResult({ type: 'success', data });
            queryClient.invalidateQueries({ queryKey: ['myCheckIns'] });
        },
        onError: (error: unknown) => {
            const err = error as { response?: { json: () => Promise<unknown> } };
            if (err.response?.json) {
                err.response.json().then((data: unknown) => {
                    const responseData = data as { checkInId?: number; status?: string };
                    if (responseData?.checkInId) {
                        setCheckInResult({
                            type: 'denied',
                            data: data as CheckInResponse,
                        });
                        queryClient.invalidateQueries({ queryKey: ['myCheckIns'] });
                    }
                });
            }
        },
    });

    const handleCheckIn = () => {
        setCheckInResult(null);
        checkInMutation.mutate();
    };

    if (variant === 'compact') {
        return (
            <div className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500/90 via-green-500/85 to-teal-500/90 p-6 shadow-xl shadow-green-300/30 animate-fade-in backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Icon */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm shrink-0">
                        <Fingerprint className="h-10 w-10 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-white">Ready to Work Out?</h2>
                        <p className="mt-1 text-sm text-green-100">Check in now to record your gym visit</p>
                    </div>

                    {/* Button */}
                    <button
                        onClick={handleCheckIn}
                        disabled={checkInMutation.isPending}
                        className={cn(
                            'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all',
                            'bg-white text-green-700 shadow-lg shadow-green-900/20',
                            'hover:bg-green-50 hover:shadow-xl hover:scale-[1.02]',
                            'active:scale-[0.98]',
                            'disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100',
                        )}
                    >
                        {checkInMutation.isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Checking in...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-5 w-5" />
                                Check In
                            </>
                        )}
                    </button>
                </div>

                {/* Check-in Result */}
                {checkInResult && (
                    <CheckInResultDisplay
                        result={checkInResult}
                        message={
                            checkInResult.type === 'success' ? 'Welcome to the gym! Enjoy your workout.' : undefined
                        }
                    />
                )}
            </div>
        );
    }

    // Full variant (default)
    return (
        <div className="overflow-hidden rounded-3xl bg-linear-to-br from-emerald-500/90 via-green-500/85 to-teal-500/90 p-6 shadow-xl shadow-green-300/30 backdrop-blur-sm">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left">
                {/* Icon */}
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm sm:mb-0 sm:mr-6 sm:h-24 sm:w-24">
                    <Fingerprint className="h-10 w-10 text-white sm:h-12 sm:w-12" />
                </div>

                {/* Content */}
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-white sm:text-2xl">Gym Check-in</h2>
                    <p className="mt-1 text-sm text-green-100 sm:text-base">
                        Tap the button below to record your gym visit
                    </p>

                    {/* Check-in Button */}
                    <button
                        onClick={handleCheckIn}
                        disabled={checkInMutation.isPending}
                        className={cn(
                            'mt-4 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all sm:px-8 sm:py-3.5 sm:text-base',
                            'bg-white text-green-700 shadow-lg shadow-green-900/20',
                            'hover:bg-green-50 hover:shadow-xl hover:scale-[1.02]',
                            'active:scale-[0.98]',
                            'disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100',
                        )}
                    >
                        {checkInMutation.isPending ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Checking in...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-5 w-5" />
                                Check In Now
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Check-in Result */}
            {checkInResult && (
                <CheckInResultDisplay
                    result={checkInResult}
                    message={
                        checkInResult.type === 'success'
                            ? 'Welcome to the gym! Your check-in has been recorded.'
                            : undefined
                    }
                />
            )}
        </div>
    );
}

interface CheckInResultDisplayProps {
    result: CheckInResultState;
    message?: string;
}

function CheckInResultDisplay({ result, message }: CheckInResultDisplayProps) {
    if (!result) return null;

    return (
        <div
            className={cn(
                'mt-5 rounded-2xl p-4 animate-fade-in',
                result.type === 'success' ? 'bg-white/20 backdrop-blur-sm' : 'bg-red-500/30 backdrop-blur-sm',
            )}
        >
            {result.type === 'success' ? (
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/30">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">Check-in Successful!</p>
                        <p className="mt-0.5 text-sm text-green-100">{message || 'Welcome to the gym!'}</p>
                        {result.data.subscription && (
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-green-100">
                                <Shield className="h-3.5 w-3.5" />
                                Subscription valid until {formatDate(result.data.subscription.endDate)}
                            </p>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/30">
                        <XCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-white">Check-in Denied</p>
                        <p className="mt-0.5 text-sm text-red-100">
                            {result.data.reason || 'No active subscription found'}
                        </p>
                        <Link
                            to="/packages"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-white underline decoration-white/50 hover:decoration-white"
                        >
                            Browse packages →
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
