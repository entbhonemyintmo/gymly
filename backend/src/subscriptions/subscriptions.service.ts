import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    SubscribeDto,
    SubscribeResponseDto,
    SubscriptionWithMemberDto,
    MySubscriptionDto,
    MySubscriptionsQueryDto,
    PaginatedMySubscriptionsDto,
    SubscriptionsQueryDto,
    PaginatedSubscriptionsDto,
} from './dto';

@Injectable()
export class SubscriptionsService {
    constructor(private readonly prisma: PrismaService) {}

    async subscribe(memberId: number, dto: SubscribeDto): Promise<SubscribeResponseDto> {
        const pkg = await this.prisma.package.findUnique({
            where: { id: dto.packageId },
        });

        if (!pkg) {
            throw new NotFoundException('Package not found');
        }

        if (!pkg.isActive) {
            throw new ForbiddenException('Package is not active');
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + pkg.durationDays);

        const result = await this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    memberId,
                    packageName: pkg.name,
                    packagePrice: pkg.price,
                    packageDurationDays: pkg.durationDays,
                    paidAmount: dto.paidAmount,
                    receiptUrl: dto.receiptUrl || null,
                    orderStatus: 'pending',
                },
            });

            const subscription = await tx.subscription.create({
                data: {
                    memberId,
                    orderId: order.id,
                    startDate,
                    endDate,
                },
            });

            return { order, subscription };
        });

        return result;
    }

    async findAll(query: SubscriptionsQueryDto): Promise<PaginatedSubscriptionsDto> {
        const { orderStatus, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where = orderStatus
            ? {
                  order: {
                      orderStatus,
                  },
              }
            : {};

        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                include: {
                    member: {
                        select: {
                            id: true,
                            name: true,
                            phoneNumber: true,
                            status: true,
                        },
                    },
                    order: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.subscription.count({ where }),
        ]);

        return {
            data: data as unknown as SubscriptionWithMemberDto[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findMySubscriptions(memberId: number, query: MySubscriptionsQueryDto): Promise<PaginatedMySubscriptionsDto> {
        const { orderStatus, page = 1, limit = 10 } = query;
        const skip = (page - 1) * limit;

        const where = {
            memberId,
            ...(orderStatus && {
                order: {
                    orderStatus,
                },
            }),
        };

        const [data, total] = await Promise.all([
            this.prisma.subscription.findMany({
                where,
                include: {
                    order: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            this.prisma.subscription.count({ where }),
        ]);

        return {
            data: data as unknown as MySubscriptionDto[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
}
