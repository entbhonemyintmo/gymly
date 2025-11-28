import { api } from '../lib/api';

export interface Package {
    id: number;
    name: string;
    description: string | null;
    price: number;
    durationDays: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export async function getPackages(): Promise<Package[]> {
    return api.get('packages').json<Package[]>();
}
