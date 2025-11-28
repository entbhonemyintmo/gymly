import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    User,
    Mail,
    Shield,
    Hash,
    LogOut,
    ChevronRight,
    Sparkles,
    Settings,
    Bell,
    HelpCircle,
    Crown,
    Phone,
    Calendar,
    CheckCircle2,
    Clock,
    XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';
import type { MemberStatus } from '../../api/auth';

const ROLE_CONFIG = {
    admin: {
        label: 'Administrator',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        icon: Crown,
        description: 'Full system access',
    },
    staff: {
        label: 'Staff Member',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        icon: Shield,
        description: 'Staff privileges',
    },
    member: {
        label: 'Member',
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: Sparkles,
        description: 'Gym membership active',
    },
} as const;

const MEMBER_STATUS_CONFIG: Record<
    MemberStatus,
    { label: string; color: string; bgColor: string; icon: typeof CheckCircle2 }
> = {
    approved: {
        label: 'Active',
        color: 'text-green-700',
        bgColor: 'bg-green-100 border-green-200',
        icon: CheckCircle2,
    },
    pending: {
        label: 'Pending Approval',
        color: 'text-amber-700',
        bgColor: 'bg-amber-100 border-amber-200',
        icon: Clock,
    },
    rejected: {
        label: 'Inactive',
        color: 'text-red-700',
        bgColor: 'bg-red-100 border-red-200',
        icon: XCircle,
    },
};

function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatMemberSince(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth());

    if (diffInMonths < 1) {
        return 'Less than a month';
    } else if (diffInMonths === 1) {
        return '1 month';
    } else if (diffInMonths < 12) {
        return `${diffInMonths} months`;
    } else {
        const years = Math.floor(diffInMonths / 12);
        const months = diffInMonths % 12;
        if (months === 0) {
            return `${years} year${years > 1 ? 's' : ''}`;
        }
        return `${years} year${years > 1 ? 's' : ''}, ${months} month${months > 1 ? 's' : ''}`;
    }
}

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <p className="text-gray-500">No user data available</p>
                </div>
            </div>
        );
    }

    const roleConfig = ROLE_CONFIG[user.role];
    const RoleIcon = roleConfig.icon;
    const memberStatusConfig = user.member ? MEMBER_STATUS_CONFIG[user.member.status] : null;
    const StatusIcon = memberStatusConfig?.icon;

    // Use member name for initials if available, otherwise use email
    const displayName = user.member?.name || user.email;
    const initials = user.member?.name
        ? user.member.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)
        : user.email.slice(0, 2).toUpperCase();

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* Profile Header Card */}
            <div
                className="relative my-10 overflow-hidden rounded-3xl bg-linear-to-br from-green-600 via-emerald-600 to-teal-600 p-6 text-white shadow-xl animate-fade-in"
                style={{ animationDelay: '0ms' }}
            >
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />

                <div className="relative flex items-center gap-5">
                    {/* Avatar */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm ring-4 ring-white/30 shadow-lg">
                        <span className="text-2xl font-bold">{initials}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-bold truncate">{displayName}</h2>
                        {user.member && <p className="text-sm text-green-100 truncate mt-0.5">{user.email}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-sm font-medium">
                                <RoleIcon className="h-4 w-4" />
                                <span>{roleConfig.label}</span>
                            </div>
                            {memberStatusConfig && StatusIcon && (
                                <div
                                    className={cn(
                                        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium',
                                        user.member?.status === 'approved'
                                            ? 'bg-white/30 text-white'
                                            : user.member?.status === 'pending'
                                              ? 'bg-amber-400/30 text-amber-100'
                                              : 'bg-red-400/30 text-red-100',
                                    )}
                                >
                                    <StatusIcon className="h-4 w-4" />
                                    <span>{memberStatusConfig.label}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Member Since Badge */}
                {user.member && (
                    <div className="relative mt-5 pt-5 border-t border-white/20">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-green-100">Member since</span>
                            <span className="font-semibold">{formatMemberSince(user.member.createdAt)}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Member Information (only if member exists) */}
            {user.member && (
                <div
                    className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-fade-in"
                    style={{ animationDelay: '50ms' }}
                >
                    <div className="border-b border-gray-100 px-5 py-4">
                        <h3 className="text-sm font-semibold text-gray-900">Member Information</h3>
                    </div>

                    <div className="divide-y divide-gray-50">
                        {/* Full Name */}
                        <div className="flex items-center gap-4 px-5 py-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                                <User className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="font-medium text-gray-900">{user.member.name}</p>
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="flex items-center gap-4 px-5 py-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                                <Phone className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Phone Number</p>
                                <p className="font-medium text-gray-900">{user.member.phoneNumber}</p>
                            </div>
                        </div>

                        {/* Member Status */}
                        <div className="flex items-center gap-4 px-5 py-4">
                            <div
                                className={cn(
                                    'flex h-10 w-10 items-center justify-center rounded-xl',
                                    user.member.status === 'approved'
                                        ? 'bg-green-100 text-green-600'
                                        : user.member.status === 'pending'
                                          ? 'bg-amber-100 text-amber-600'
                                          : 'bg-red-100 text-red-600',
                                )}
                            >
                                {StatusIcon && <StatusIcon className="h-5 w-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Membership Status</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span
                                        className={cn(
                                            'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                                            memberStatusConfig?.bgColor,
                                            memberStatusConfig?.color,
                                        )}
                                    >
                                        {StatusIcon && <StatusIcon className="h-3 w-3" />}
                                        {memberStatusConfig?.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Join Date */}
                        <div className="flex items-center gap-4 px-5 py-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                <Calendar className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Member Since</p>
                                <p className="font-medium text-gray-900">{formatDate(user.member.createdAt)}</p>
                            </div>
                        </div>

                        {/* Member ID */}
                        <div className="flex items-center gap-4 px-5 py-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                                <Hash className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500">Member ID</p>
                                <p className="font-medium text-gray-900">#{user.member.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Account Information */}
            <div
                className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-fade-in"
                style={{ animationDelay: '100ms' }}
            >
                <div className="border-b border-gray-100 px-5 py-4">
                    <h3 className="text-sm font-semibold text-gray-900">Account Information</h3>
                </div>

                <div className="divide-y divide-gray-50">
                    {/* User ID */}
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                            <Hash className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">User ID</p>
                            <p className="font-medium text-gray-900">#{user.userId}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                            <Mail className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Email Address</p>
                            <p className="font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Role */}
                    <div className="flex items-center gap-4 px-5 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Account Role</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span
                                    className={cn(
                                        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                                        roleConfig.color,
                                    )}
                                >
                                    <RoleIcon className="h-3 w-3" />
                                    {roleConfig.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div
                className="mt-6 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden animate-fade-in"
                style={{ animationDelay: '200ms' }}
            >
                <div className="border-b border-gray-100 px-5 py-4">
                    <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
                </div>

                <div className="divide-y divide-gray-50">
                    <button className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <Settings className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">Account Settings</p>
                            <p className="text-xs text-gray-500">Update your preferences</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>

                    <button className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <Bell className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">Notifications</p>
                            <p className="text-xs text-gray-500">Manage your alerts</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>

                    <button className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                            <HelpCircle className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">Help & Support</p>
                            <p className="text-xs text-gray-500">Get assistance</p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Logout Button */}
            <div className="mt-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
                {!showLogoutConfirm ? (
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-600 transition-all hover:bg-red-100 hover:border-red-300"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                ) : (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                        <p className="text-center text-sm font-medium text-red-800 mb-4">
                            Are you sure you want to sign out?
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Version info */}
            <p className="mt-8 text-center text-xs text-gray-400 animate-fade-in" style={{ animationDelay: '400ms' }}>
                Gymly v1.0.0 • Made with 💚
            </p>
        </div>
    );
}
