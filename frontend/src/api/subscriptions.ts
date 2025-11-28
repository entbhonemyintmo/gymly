import { api } from '../lib/api';

export interface SubscribeRequest {
    packageId: number;
    paidAmount: number;
    receiptUrl?: string;
}

export interface OrderResponse {
    id: number;
    memberId: number;
    packageName: string;
    packagePrice: number;
    packageDurationDays: number;
    paidAmount: number;
    receiptUrl: string | null;
    orderStatus: 'pending' | 'approved' | 'rejected';
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

export async function subscribe(data: SubscribeRequest): Promise<SubscribeResponse> {
    return api.post('subscriptions/subscribe', { json: data }).json();
}
