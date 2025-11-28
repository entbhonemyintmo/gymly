import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestNotificationPermission } from '../lib/firebase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as { from?: string })?.from || '/';

    useEffect(() => {
        requestNotificationPermission();
    }, []);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(34,197,94,0.12)_0%,transparent_50%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.12)_0%,transparent_50%)] pointer-events-none" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                    backgroundImage: `linear-gradient(rgba(34,197,94,0.3) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(34,197,94,0.3) 1px, transparent 1px)`,
                    backgroundSize: '60px 60px',
                }}
            />

            {/* Floating orbs */}
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-green-500/15 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="relative z-10 w-full max-w-md px-6">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/25 mb-6">
                        <span className="text-3xl" role="img" aria-label="gym">
                            💪
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2 font-[system-ui]">
                        Welcome back
                    </h1>
                    <p className="text-gray-500">Sign in to your Gymly account</p>
                </div>

                {/* Login Card */}
                <div className="backdrop-blur-xl bg-white border border-gray-200 rounded-3xl p-8 shadow-xl shadow-green-500/5">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Alert */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3">
                                <span className="text-lg shrink-0" role="img" aria-label="error">
                                    ⚠️
                                </span>
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email Input */}
                        <div className="space-y-2">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400" role="img" aria-label="email">
                                        ✉️
                                    </span>
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-gray-400" role="img" aria-label="password">
                                        🔒
                                    </span>
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all duration-200"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="relative w-full py-3.5 px-6 rounded-xl font-semibold text-white overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
                        >
                            {/* Gradient background */}
                            <div className="absolute inset-0 bg-linear-to-r from-green-500 to-emerald-600 transition-all duration-300 group-hover:scale-105" />

                            {/* Shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.2)_50%,transparent_60%)] bg-size-[200%_100%] animate-[shimmer_1.5s_infinite]" />

                            <span className="relative flex items-center justify-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <span className="animate-spin inline-block">⏳</span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <span className="transition-transform group-hover:translate-x-1 inline-block">
                                            →
                                        </span>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                {/* Footer text */}
                <p className="text-center text-gray-400 text-sm mt-8">
                    Powered by{' '}
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-green-500 to-emerald-600 font-medium">
                        Gymly
                    </span>
                </p>
            </div>

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
}
