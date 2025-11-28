import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { NotificationType } from '../../../generated/prisma/client';

export class NotificationDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    userId: number;

    @ApiProperty({ enum: ['subscription_request', 'subscription_approved', 'subscription_rejected'] })
    type: NotificationType;

    @ApiProperty()
    title: string;

    @ApiProperty()
    body: string;

    @ApiPropertyOptional()
    data?: Record<string, unknown>;

    @ApiProperty()
    isRead: boolean;

    @ApiProperty()
    createdAt: Date;
}

export class NotificationsQueryDto {
    @ApiPropertyOptional({ description: 'Filter by read status' })
    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isRead?: boolean;

    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 20;
}

export class PaginatedNotificationsDto {
    @ApiProperty({ type: [NotificationDto] })
    data: NotificationDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPages: number;

    @ApiProperty()
    unreadCount: number;
}

export class MarkAsReadDto {
    @ApiProperty({ type: [Number], description: 'Array of notification IDs to mark as read' })
    @IsInt({ each: true })
    @Type(() => Number)
    notificationIds: number[];
}

export class UnreadCountDto {
    @ApiProperty()
    count: number;
}
