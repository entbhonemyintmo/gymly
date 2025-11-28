import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsPositive, IsString, IsUrl } from 'class-validator';

export class SubscribeDto {
    @ApiProperty({ example: 1, description: 'Package ID to subscribe to' })
    @IsInt()
    @IsPositive()
    packageId: number;

    @ApiProperty({ example: 5000, description: 'Amount paid in cents' })
    @IsInt()
    @IsPositive()
    paidAmount: number;

    @ApiProperty({ example: 'https://example.com/receipt.jpg', description: 'Receipt URL', required: false })
    @IsOptional()
    @IsString()
    @IsUrl()
    receiptUrl?: string;
}
