import { UserRole } from '../../../generated/prisma/client';

export interface JwtPayload {
    sub: number;
    email: string;
    role: UserRole;
    memberId: number | null;
}

export interface JwtPayloadWithTimestamps extends JwtPayload {
    iat: number;
    exp: number;
}
