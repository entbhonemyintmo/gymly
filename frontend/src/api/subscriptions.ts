import { api } from '../lib/api';

export interface SubscribeRequest {
    packageId: number;
    paidAmount: number;
    receiptUrl?: string;
}

export type OrderStatus = 'pending' | 'approved' | 'rejected';

export interface OrderResponse {
    id: number;
    memberId: number;
    packageName: string;
    packagePrice: number;
    packageDurationDays: number;
    paidAmount: number;
    receiptUrl: string | null;
    orderStatus: OrderStatus;
    reason?: string | null;
    createdAt: string;
}

export interface SubscriptionResponse {
    id: number;
    memberId: number;
    orderId: number;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
}

export interface SubscribeResponse {
    order: OrderResponse;
    subscription: SubscriptionResponse;
}

export interface MySubscription {
    id: number;
    memberId: number;
    orderId: number;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    order: OrderResponse;
}

export interface PaginatedMySubscriptions {
    data: MySubscription[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface MySubscriptionsQuery {
    orderStatus?: OrderStatus;
    page?: number;
    limit?: number;
}

export async function subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
    return api.post('subscriptions/subscribe', { json: data }).json();
}

export async function getMySubscriptions(query?: MySubscriptionsQuery): Promise<PaginatedMySubscriptions> {
    const searchParams = new URLSearchParams();
    if (query?.orderStatus) searchParams.set('orderStatus', query.orderStatus);
    if (query?.page) searchParams.set('page', query.page.toString());
    if (query?.limit) searchParams.set('limit', query.limit.toString());

    return api.get('subscriptions/me', { searchParams }).json();
}
