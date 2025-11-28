import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class DenySubscriptionDto {
    @ApiPropertyOptional({
        example: 'Payment receipt is unclear',
        description: 'Reason for denying the subscription',
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    reason?: string;
}

export class ApproveSubscriptionResponseDto {
    @ApiProperty({ example: 1, description: 'Subscription ID' })
    subscriptionId: number;

    @ApiProperty({ example: 1, description: 'Order ID' })
    orderId: number;

    @ApiProperty({ example: 'approved', description: 'New order status' })
    orderStatus: string;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Subscription start date' })
    startDate: Date;

    @ApiProperty({ example: '2024-01-31T00:00:00.000Z', description: 'Subscription end date' })
    endDate: Date;

    @ApiProperty({ example: 'Subscription approved successfully', description: 'Success message' })
    message: string;
}

export class DenySubscriptionResponseDto {
    @ApiProperty({ example: 1, description: 'Subscription ID' })
    subscriptionId: number;

    @ApiProperty({ example: 1, description: 'Order ID' })
    orderId: number;

    @ApiProperty({ example: 'rejected', description: 'New order status' })
    orderStatus: string;

    @ApiPropertyOptional({ example: 'Payment receipt is unclear', description: 'Reason for denial' })
    reason?: string;

    @ApiProperty({ example: 'Subscription denied', description: 'Success message' })
    message: string;
}
