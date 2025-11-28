import { api } from '../lib/api';

export type NotificationType = 'subscription_request' | 'subscription_approved' | 'subscription_rejected';

export interface Notification {
    id: number;
    userId: number;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    isRead: boolean;
    createdAt: string;
}

export interface PaginatedNotifications {
    data: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
}

export interface NotificationsQuery {
    isRead?: boolean;
    page?: number;
    limit?: number;
}

export interface UnreadCount {
    count: number;
}

export interface MarkAsReadResponse {
    count: number;
}

export async function getNotifications(query?: NotificationsQuery): Promise<PaginatedNotifications> {
    const searchParams = new URLSearchParams();
    if (query?.isRead !== undefined) searchParams.set('isRead', String(query.isRead));
    if (query?.page) searchParams.set('page', query.page.toString());
    if (query?.limit) searchParams.set('limit', query.limit.toString());

    return api.get('notifications', { searchParams }).json();
}

export async function getUnreadCount(): Promise<UnreadCount> {
    return api.get('notifications/unread-count').json();
}

export async function markAsRead(notificationIds: number[]): Promise<MarkAsReadResponse> {
    return api.post('notifications/mark-read', { json: { notificationIds } }).json();
}

export async function markAllAsRead(): Promise<MarkAsReadResponse> {
    return api.post('notifications/mark-all-read').json();
}
