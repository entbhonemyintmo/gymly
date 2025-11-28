import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface DenySubscriptionModalProps {
    isOpen: boolean;
    isLoading: boolean;
    onConfirm: (reason?: string) => void;
    onCancel: () => void;
}

export function DenySubscriptionModal({ isOpen, isLoading, onConfirm, onCancel }: DenySubscriptionModalProps) {
    const [reason, setReason] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm(reason || undefined);
        setReason('');
    };

    const handleCancel = () => {
        onCancel();
        setReason('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Deny Subscription</h3>
                <p className="text-sm text-slate-400 mb-4">
                    Are you sure you want to deny this subscription request? You can optionally provide a reason.
                </p>
                <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for denial (optional)"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none"
                    rows={3}
                />
                <div className="flex items-center justify-end gap-3 mt-4">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Deny Subscription
                    </button>
                </div>
            </div>
        </div>
    );
}
