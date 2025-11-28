import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
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
    DenySubscriptionDto,
    ApproveSubscriptionResponseDto,
    DenySubscriptionResponseDto,
} from './dto';

@Injectable()
export class SubscriptionsService {
    constructor(private readonly prisma: PrismaService) {}

    async subscribe(memberId: number, dto: SubscribeDto, receiptUrl?: string): Promise<SubscribeResponseDto> {
        const pkg = await this.prisma.package.findUnique({
            where: { id: dto.packageId },
        });

        if (!pkg) {
            throw new NotFoundException('Package not found');
        }

        if (!pkg.isActive) {
            throw new ForbiddenException('Package is not active');
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const order = await tx.order.create({
                data: {
                    memberId,
                    packageName: pkg.name,
                    packagePrice: pkg.price,
                    packageDurationDays: pkg.durationDays,
                    paidAmount: dto.paidAmount,
                    receiptUrl: receiptUrl || null,
                    orderStatus: 'pending',
                },
            });

            const subscription = await tx.subscription.create({
                data: {
                    memberId,
                    orderId: order.id,
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

    async approve(subscriptionId: number): Promise<ApproveSubscriptionResponseDto> {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { order: true },
        });

        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }

        if (!subscription.order) {
            throw new NotFoundException('Associated order not found');
        }

        if (subscription.order.orderStatus !== 'pending') {
            throw new BadRequestException(
                `Cannot approve subscription: order status is already '${subscription.order.orderStatus}'`,
            );
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + subscription.order.packageDurationDays);

        const [updatedOrder, updatedSubscription] = await this.prisma.$transaction([
            this.prisma.order.update({
                where: { id: subscription.orderId },
                data: { orderStatus: 'approved', reason: null },
            }),
            this.prisma.subscription.update({
                where: { id: subscriptionId },
                data: { startDate, endDate },
            }),
        ]);

        return {
            subscriptionId: updatedSubscription.id,
            orderId: updatedOrder.id,
            orderStatus: updatedOrder.orderStatus,
            startDate: updatedSubscription.startDate!,
            endDate: updatedSubscription.endDate!,
            message: 'Subscription approved successfully',
        };
    }

    async deny(subscriptionId: number, dto: DenySubscriptionDto): Promise<DenySubscriptionResponseDto> {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id: subscriptionId },
            include: { order: true },
        });

        if (!subscription) {
            throw new NotFoundException('Subscription not found');
        }

        if (!subscription.order) {
            throw new NotFoundException('Associated order not found');
        }

        if (subscription.order.orderStatus !== 'pending') {
            throw new BadRequestException(
                `Cannot deny subscription: order status is already '${subscription.order.orderStatus}'`,
            );
        }

        const updatedOrder = await this.prisma.order.update({
            where: { id: subscription.orderId },
            data: {
                orderStatus: 'rejected',
                reason: dto.reason || null,
            },
        });

        return {
            subscriptionId: subscription.id,
            orderId: updatedOrder.id,
            orderStatus: updatedOrder.orderStatus,
            reason: updatedOrder.reason || undefined,
            message: 'Subscription denied',
        };
    }
}
