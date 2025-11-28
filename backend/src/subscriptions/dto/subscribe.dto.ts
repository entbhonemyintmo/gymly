import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export class SubscribeDto {
    @ApiProperty({ example: 1, description: 'Package ID to subscribe to' })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @IsPositive()
    packageId: number;

    @ApiProperty({ example: 5000, description: 'Amount paid in cents' })
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt()
    @IsPositive()
    paidAmount: number;
}
