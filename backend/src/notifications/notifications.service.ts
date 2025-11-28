import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from './firebase.service';
import { NotificationType, Prisma } from '../../generated/prisma/client';
import {
    RegisterFcmTokenDto,
    NotificationsQueryDto,
    PaginatedNotificationsDto,
    NotificationDto,
    UnreadCountDto,
} from './dto';

export interface SendNotificationPayload {
    userId: number;
    type: NotificationType;
    title: string;
    body: string;
    data?: Record<string, unknown>;
}

@Injectable()
export class NotificationsService {
    private readonly logger = new Logger(NotificationsService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly firebaseService: FirebaseService,
    ) {}

    async registerFcmToken(userId: number, dto: RegisterFcmTokenDto): Promise<{ success: boolean }> {
        await this.prisma.fcmToken.upsert({
            where: { token: dto.token },
            update: {
                userId,
                deviceId: dto.deviceId,
                platform: dto.platform,
                updatedAt: new Date(),
            },
            create: {
                userId,
                token: dto.token,
                deviceId: dto.deviceId,
                platform: dto.platform,
            },
        });

        this.logger.log(`FCM token registered for user ${userId}`);
        return { success: true };
    }

    async removeFcmToken(token: string): Promise<{ success: boolean }> {
        try {
            await this.prisma.fcmToken.delete({
                where: { token },
            });

            this.logger.log(`FCM token removed: ${token.substring(0, 20)}...`);
            return { success: true };
        } catch {
            return { success: false };
        }
    }

    async sendNotification(payload: SendNotificationPayload): Promise<NotificationDto> {
        const notification = await this.prisma.notification.create({
            data: {
                userId: payload.userId,
                type: payload.type,
                title: payload.title,
                body: payload.body,
                data: payload.data as Prisma.InputJsonValue | undefined,
            },
        });

        const fcmTokens = await this.prisma.fcmToken.findMany({
            where: { userId: payload.userId },
            select: { token: true },
        });

        if (fcmTokens.length > 0) {
            const tokens = fcmTokens.map((t) => t.token);
            const stringData = payload.data
                ? Object.fromEntries(Object.entries(payload.data).map(([k, v]) => [k, String(v)]))
                : undefined;

            await this.firebaseService.sendMulticastNotification({
                tokens,
                title: payload.title,
                body: payload.body,
                data: stringData,
            });
        }

        return notification as NotificationDto;
    }

    async sendNotificationToAdmins(
        type: NotificationType,
        title: string,
        body: string,
        data?: Record<string, unknown>,
    ): Promise<void> {
        const admins = await this.prisma.user.findMany({
            where: { role: 'admin' },
            select: { id: true },
        });

        for (const admin of admins) {
            await this.sendNotification({
                userId: admin.id,
                type,
                title,
                body,
                data,
            });
        }

        this.logger.log(`Notification sent to ${admins.length} admin(s): ${title}`);
    }

    async getNotifications(userId: number, query: NotificationsQueryDto): Promise<PaginatedNotificationsDto> {
        const { isRead, page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(isRead !== undefined && { isRead }),
        };

        const [data, total, unreadCount] = await Promise.all([
            this.prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.notification.count({ where }),
            this.prisma.notification.count({
                where: { userId, isRead: false },
            }),
        ]);

        return {
            data: data as NotificationDto[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
            unreadCount,
        };
    }

    async markAsRead(userId: number, notificationIds: number[]): Promise<{ count: number }> {
        const result = await this.prisma.notification.updateMany({
            where: {
                id: { in: notificationIds },
                userId,
            },
            data: { isRead: true },
        });

        return { count: result.count };
    }

    async markAllAsRead(userId: number): Promise<{ count: number }> {
        const result = await this.prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });

        return { count: result.count };
    }

    async getUnreadCount(userId: number): Promise<UnreadCountDto> {
        const count = await this.prisma.notification.count({
            where: { userId, isRead: false },
        });

        return { count };
    }
}
