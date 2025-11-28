import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../generated/prisma/client';

export class AuthUserDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    userId: number;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    email: string;

    @ApiProperty({ enum: ['admin', 'staff', 'member'], description: 'User role' })
    role: UserRole;

    @ApiProperty({ example: 1, description: 'Member ID if user is a member', nullable: true })
    memberId: number | null;
}

export class LoginResponseDto {
    @ApiProperty({ description: 'JWT access token' })
    accessToken: string;

    @ApiProperty({ type: AuthUserDto, description: 'Authenticated user details' })
    user: AuthUserDto;
}
