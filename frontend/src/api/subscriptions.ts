import { api } from '../lib/api';

export interface SubscribeRequest {
    packageId: number;
    paidAmount: number;
    receiptUrl?: string;
}

export type OrderStatus = 'pending' | 'approved' | 'rejected';
export type MemberStatus = 'approved' | 'pending' | 'rejected';

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

// Admin types
export interface MemberInfo {
    id: number;
    name: string;
    phoneNumber: string;
    status: MemberStatus;
}

export interface SubscriptionWithMember {
    id: number;
    memberId: number;
    orderId: number;
    startDate: string | null;
    endDate: string | null;
    createdAt: string;
    member: MemberInfo;
    order: OrderResponse;
}

export interface PaginatedSubscriptions {
    data: SubscriptionWithMember[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface SubscriptionsQuery {
    orderStatus?: OrderStatus;
    page?: number;
    limit?: number;
}

export interface ApproveSubscriptionResponse {
    subscriptionId: number;
    orderId: number;
    orderStatus: string;
    startDate: string;
    endDate: string;
    message: string;
}

export interface DenySubscriptionResponse {
    subscriptionId: number;
    orderId: number;
    orderStatus: string;
    reason?: string;
    message: string;
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

// Admin endpoints
export async function getSubscriptions(query?: SubscriptionsQuery): Promise<PaginatedSubscriptions> {
    const searchParams = new URLSearchParams();
    if (query?.orderStatus) searchParams.set('orderStatus', query.orderStatus);
    if (query?.page) searchParams.set('page', query.page.toString());
    if (query?.limit) searchParams.set('limit', query.limit.toString());

    return api.get('subscriptions', { searchParams }).json();
}

export async function approveSubscription(subscriptionId: number): Promise<ApproveSubscriptionResponse> {
    return api.post(`subscriptions/${subscriptionId}/approve`).json();
}

export async function denySubscription(subscriptionId: number, reason?: string): Promise<DenySubscriptionResponse> {
    return api.post(`subscriptions/${subscriptionId}/deny`, { json: { reason } }).json();
}
