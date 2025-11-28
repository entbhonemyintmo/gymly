import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function UserHomePage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="grid gap-4">
                <div className="rounded-2xl p-6 shadow-sm border border-green-100">
                    <h2 className="text-lg font-semibold text-green-900 mb-2">Welcome to Special Offers!</h2>
                    <p className="text-green-600">Complete tasks to unlock exclusive vouchers and deals.</p>
                </div>
            </div>
        </div>
    );
}
