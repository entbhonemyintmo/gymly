import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { CheckInStatus } from '../../../generated/prisma/client';

export class CheckInDto {
    @ApiPropertyOptional({
        example: 1,
        description: 'Member ID to check in (optional for members, required for staff/admin)',
    })
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    memberId?: number;
}

export class CheckInResponseDto {
    @ApiProperty({ example: 1, description: 'Check-in record ID' })
    id: number;

    @ApiProperty({ example: 1, description: 'Member ID' })
    memberId: number;

    @ApiProperty({ enum: CheckInStatus, example: 'allowed', description: 'Check-in status' })
    status: CheckInStatus;

    @ApiPropertyOptional({ example: 'No active subscription', description: 'Reason for denial' })
    reason?: string;

    @ApiProperty({ example: '2025-11-28T10:00:00.000Z', description: 'Check-in timestamp' })
    createdAt: Date;
}

export class CheckInDetailResponseDto extends CheckInResponseDto {
    @ApiPropertyOptional({
        description: 'Member information',
        example: { id: 1, name: 'John Doe', phoneNumber: '+1234567890' },
    })
    member?: {
        id: number;
        name: string;
        phoneNumber: string;
    };

    @ApiPropertyOptional({
        description: 'Active subscription details (if any)',
        example: { id: 1, startDate: '2025-11-01', endDate: '2025-12-01' },
    })
    subscription?: {
        id: number;
        startDate: Date;
        endDate: Date;
    };
}
