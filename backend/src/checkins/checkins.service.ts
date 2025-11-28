import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    CheckInDetailResponseDto,
    CheckInHistoryQueryDto,
    PaginatedCheckInHistoryDto,
    PaginatedCheckInHistoryWithMemberDto,
    CheckInHistoryItemDto,
    CheckInHistoryWithMemberDto,
} from './dto';
import { CheckInStatus } from '../../generated/prisma/client';

@Injectable()
export class CheckInsService {
    constructor(private readonly prisma: PrismaService) {}

    async checkIn(memberId: number): Promise<CheckInDetailResponseDto> {
        const member = await this.prisma.member.findUnique({
            where: { id: memberId },
            select: {
                id: true,
                name: true,
                phoneNumber: true,
                status: true,
            },
        });

        if (!member) {
            throw new NotFoundException(`Member with ID ${memberId} not found`);
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const activeSubscription = await this.prisma.subscription.findFirst({
            where: {
                memberId,
                startDate: { lte: new Date() },
                endDate: { gte: today },
                order: {
                    orderStatus: 'approved',
                },
            },
            orderBy: {
                endDate: 'desc',
            },
            select: {
                id: true,
                startDate: true,
                endDate: true,
            },
        });

        const hasActiveSubscription = !!activeSubscription;
        const status: CheckInStatus = hasActiveSubscription ? 'allowed' : 'denied';
        const reason = hasActiveSubscription ? null : 'No active subscription';

        const checkIn = await this.prisma.checkIn.create({
            data: {
                memberId,
                status,
                reason,
            },
        });

        if (!hasActiveSubscription) {
            throw new ForbiddenException({
                message: 'No active subscription',
                checkInId: checkIn.id,
                memberId: checkIn.memberId,
                status: checkIn.status,
            });
        }

        return {
            id: checkIn.id,
            memberId: checkIn.memberId,
            status: checkIn.status,
            reason: checkIn.reason ?? undefined,
            createdAt: checkIn.createdAt,
            member: {
                id: member.id,
                name: member.name,
                phoneNumber: member.phoneNumber,
            },
            subscription: {
                id: activeSubscription.id,
                startDate: activeSubscription.startDate!,
                endDate: activeSubscription.endDate!,
            },
        };
    }

    async findMyCheckIns(memberId: number, query: CheckInHistoryQueryDto): Promise<PaginatedCheckInHistoryDto> {
        const { status, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where = {
            memberId,
            ...(status && { status }),
        };

        const [data, total] = await Promise.all([
            this.prisma.checkIn.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.checkIn.count({ where }),
        ]);

        return {
            data: data.map((item) => ({
                id: item.id,
                memberId: item.memberId,
                status: item.status,
                reason: item.reason ?? undefined,
                createdAt: item.createdAt,
            })) as CheckInHistoryItemDto[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findAll(query: CheckInHistoryQueryDto): Promise<PaginatedCheckInHistoryWithMemberDto> {
        const { status, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where = status ? { status } : {};

        const [data, total] = await Promise.all([
            this.prisma.checkIn.findMany({
                where,
                include: {
                    member: {
                        select: {
                            id: true,
                            name: true,
                            phoneNumber: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.checkIn.count({ where }),
        ]);

        return {
            data: data.map((item) => ({
                id: item.id,
                memberId: item.memberId,
                status: item.status,
                reason: item.reason ?? undefined,
                createdAt: item.createdAt,
                member: item.member!,
            })) as CheckInHistoryWithMemberDto[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
