const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export type UserRole = 'admin' | 'staff' | 'member';
export type MemberStatus = 'approved' | 'pending' | 'rejected';

export interface MemberInfo {
    id: number;
    name: string;
    phoneNumber: string;
    status: MemberStatus;
    createdAt: string;
}

export interface AuthUser {
    userId: number;
    email: string;
    role: UserRole;
    memberId: number | null;
    member?: MemberInfo;
}

export interface LoginResponse {
    accessToken: string;
    user: AuthUser;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
            message: 'Login failed',
            statusCode: response.status,
        }));
        throw new Error(error.message || 'Invalid credentials');
    }

    return response.json();
}

export async function getMe(token: string): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }

    return response.json();
}
