import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckInStatus } from '../../../generated/prisma/client';

export class CheckInHistoryQueryDto {
    @ApiPropertyOptional({
        enum: CheckInStatus,
        description: 'Filter by check-in status',
    })
    @IsOptional()
    @IsEnum(CheckInStatus)
    status?: CheckInStatus;

    @ApiPropertyOptional({ example: 1, description: 'Page number', default: 1 })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, description: 'Items per page', default: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number = 10;
}

export class CheckInHistoryItemDto {
    @ApiProperty({ example: 1, description: 'Check-in ID' })
    id: number;

    @ApiProperty({ example: 1, description: 'Member ID' })
    memberId: number;

    @ApiProperty({ enum: CheckInStatus, example: 'allowed', description: 'Check-in status' })
    status: CheckInStatus;

    @ApiPropertyOptional({ example: 'No active subscription', description: 'Reason if denied' })
    reason?: string;

    @ApiProperty({ example: '2025-11-28T10:00:00.000Z', description: 'Check-in timestamp' })
    createdAt: Date;
}

export class CheckInHistoryWithMemberDto extends CheckInHistoryItemDto {
    @ApiProperty({
        description: 'Member information',
    })
    member: {
        id: number;
        name: string;
        phoneNumber: string;
    };
}

export class PaginatedCheckInHistoryDto {
    @ApiProperty({ type: [CheckInHistoryItemDto], description: 'List of check-ins' })
    data: CheckInHistoryItemDto[];

    @ApiProperty({ example: 100, description: 'Total number of records' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page' })
    page: number;

    @ApiProperty({ example: 10, description: 'Items per page' })
    limit: number;

    @ApiProperty({ example: 10, description: 'Total pages' })
    totalPages: number;
}

export class PaginatedCheckInHistoryWithMemberDto {
    @ApiProperty({ type: [CheckInHistoryWithMemberDto], description: 'List of check-ins with member info' })
    data: CheckInHistoryWithMemberDto[];

    @ApiProperty({ example: 100, description: 'Total number of records' })
    total: number;

    @ApiProperty({ example: 1, description: 'Current page' })
    page: number;

    @ApiProperty({ example: 10, description: 'Items per page' })
    limit: number;

    @ApiProperty({ example: 10, description: 'Total pages' })
    totalPages: number;
}
