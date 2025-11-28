import { ApiProperty } from '@nestjs/swagger';

export class PackageDto {
    @ApiProperty({ example: 1, description: 'Package ID' })
    id: number;

    @ApiProperty({ example: 'Monthly Membership', description: 'Package name' })
    name: string;

    @ApiProperty({ example: 'Full gym access for one month', description: 'Package description', nullable: true })
    description: string | null;

    @ApiProperty({ example: 5000, description: 'Package price in cents' })
    price: number;

    @ApiProperty({ example: 30, description: 'Package duration in days' })
    durationDays: number;

    @ApiProperty({ example: true, description: 'Whether the package is active' })
    isActive: boolean;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Creation timestamp' })
    createdAt: Date;

    @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Last update timestamp' })
    updatedAt: Date;
}
