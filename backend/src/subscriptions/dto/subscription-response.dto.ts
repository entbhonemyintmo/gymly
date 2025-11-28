import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus, MemberStatus } from '../../../generated/prisma/client';
import { IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class MySubscriptionsQueryDto {
    @ApiPropertyOptional({ enum: ['pending', 'approved', 'rejected'], description: 'Filter by order status' })
    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus?: OrderStatus;

    @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}

export class MemberInfoDto {
    @ApiProperty({ example: 1, description: 'Member ID' })
    id: number;

    @ApiProperty({ example: 'John Doe', description: 'Member name' })
    name: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number' })
    phoneNumber: string;

    @ApiProperty({ enum: ['approved', 'pending', 'rejected'], description: 'Member status' })
    status: MemberStatus;
}

export class OrderResponseDto {
    @ApiProperty({ example: 1, description: 'Order ID' })
    id: number;

    @ApiProperty({ example: 1, description: 'Member ID' })
    memberId: number;

    @ApiProperty({ example: 'Monthly Membership', description: 'Package name' })
    packageName: string;

    @ApiProperty({ example: 5000, description: 'Package price in cents' })
    packagePrice: number;

    @ApiProperty({ example: 30, description: 'Package duration in days' })
    packageDurationDays: number;

    @ApiProperty({ example: 5000, description: 'Amount paid in cents' })
    paidAmount: number;

    @ApiProperty({ example: 'https://example.com/receipt.jpg', description: 'Receipt URL', nullable: true })
    receiptUrl: string | null;

    @ApiProperty({ enum: ['pending', 'approved', 'rejected'], description: 'Order status' })
    orderStatus: OrderStatus;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
    createdAt: Date;
}

export class SubscriptionResponseDto {
    @ApiProperty({ example: 1, description: 'Subscription ID' })
    id: number;

    @ApiProperty({ example: 1, description: 'Member ID' })
    memberId: number;

    @ApiProperty({ example: 1, description: 'Order ID' })
    orderId: number;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Subscription start date (set when approved)',
        nullable: true,
    })
    startDate: Date | null;

    @ApiProperty({
        example: '2024-01-31T00:00:00.000Z',
        description: 'Subscription end date (set when approved)',
        nullable: true,
    })
    endDate: Date | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
    createdAt: Date;
}

export class SubscribeResponseDto {
    @ApiProperty({ type: OrderResponseDto, description: 'Created order' })
    order: OrderResponseDto;

    @ApiProperty({ type: SubscriptionResponseDto, description: 'Created subscription' })
    subscription: SubscriptionResponseDto;
}

export class SubscriptionWithMemberDto {
    @ApiProperty({ example: 1, description: 'Subscription ID' })
    id: number;

    @ApiProperty({ example: 1, description: 'Member ID' })
    memberId: number;

    @ApiProperty({ example: 1, description: 'Order ID' })
    orderId: number;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Subscription start date (set when approved)',
        nullable: true,
    })
    startDate: Date | null;

    @ApiProperty({
        example: '2024-01-31T00:00:00.000Z',
        description: 'Subscription end date (set when approved)',
        nullable: true,
    })
    endDate: Date | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ type: MemberInfoDto, description: 'Subscriber information' })
    member: MemberInfoDto;

    @ApiProperty({ type: OrderResponseDto, description: 'Order information' })
    order: OrderResponseDto;
}

export class MySubscriptionDto {
    @ApiProperty({ example: 1, description: 'Subscription ID' })
    id: number;

    @ApiProperty({ example: 1, description: 'Member ID' })
    memberId: number;

    @ApiProperty({ example: 1, description: 'Order ID' })
    orderId: number;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Subscription start date (set when approved)',
        nullable: true,
    })
    startDate: Date | null;

    @ApiProperty({
        example: '2024-01-31T00:00:00.000Z',
        description: 'Subscription end date (set when approved)',
        nullable: true,
    })
    endDate: Date | null;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ type: OrderResponseDto, description: 'Order information' })
    order: OrderResponseDto;
}

export class PaginatedMySubscriptionsDto {
    @ApiProperty({ type: [MySubscriptionDto], description: 'List of subscriptions' })
    data: MySubscriptionDto[];

    @ApiProperty({ example: 50, description: 'Total number of items' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    page: number;

    @ApiProperty({ example: 10, description: 'Items per page' })
    limit: number;

    @ApiProperty({ example: 5, description: 'Total number of pages' })
    totalPages: number;
}

export class SubscriptionsQueryDto {
    @ApiPropertyOptional({
        enum: ['pending', 'approved', 'rejected'],
        description: 'Filter by order status',
    })
    @IsOptional()
    @IsEnum(OrderStatus)
    orderStatus?: OrderStatus;

    @ApiPropertyOptional({ example: 1, description: 'Page number (1-based)', default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number = 10;
}

export class PaginatedSubscriptionsDto {
    @ApiProperty({ type: [SubscriptionWithMemberDto], description: 'List of subscriptions' })
    data: SubscriptionWithMemberDto[];

    @ApiProperty({ example: 50, description: 'Total number of items' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page number' })
    page: number;

    @ApiProperty({ example: 10, description: 'Items per page' })
    limit: number;

    @ApiProperty({ example: 5, description: 'Total number of pages' })
    totalPages: number;
}
