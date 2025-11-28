import { api } from '../lib/api';

export type CheckInStatus = 'allowed' | 'denied';

export interface CheckInResponse {
    id: number;
    memberId: number;
    status: CheckInStatus;
    reason?: string;
    createdAt: string;
    member?: {
        id: number;
        name: string;
        phoneNumber: string;
    };
    subscription?: {
        id: number;
        startDate: string;
        endDate: string;
    };
}

export interface CheckInHistoryItem {
    id: number;
    memberId: number;
    status: CheckInStatus;
    reason?: string;
    createdAt: string;
}

export interface PaginatedCheckInHistory {
    data: CheckInHistoryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface CheckInHistoryQuery {
    status?: CheckInStatus;
    page?: number;
    limit?: number;
}

export async function checkIn(): Promise<CheckInResponse> {
    return api.post('checkins', { json: {} }).json();
}

export async function getMyCheckIns(query?: CheckInHistoryQuery): Promise<PaginatedCheckInHistory> {
    const searchParams = new URLSearchParams();
    if (query?.status) searchParams.set('status', query.status);
    if (query?.page) searchParams.set('page', query.page.toString());
    if (query?.limit) searchParams.set('limit', query.limit.toString());

    return api.get('checkins/me', { searchParams }).json();
}

