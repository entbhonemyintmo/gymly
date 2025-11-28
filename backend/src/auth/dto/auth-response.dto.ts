import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, MemberStatus } from '../../../generated/prisma/client';

export class MemberInfoDto {
    @ApiProperty({ example: 1, description: 'Member ID' })
    id: number;

    @ApiProperty({ example: 'John Doe', description: 'Member name' })
    name: string;

    @ApiProperty({ example: '+1234567890', description: 'Phone number' })
    phoneNumber: string;

    @ApiProperty({ enum: ['approved', 'pending', 'rejected'], description: 'Member status' })
    status: MemberStatus;

    @ApiProperty({ description: 'Member creation date' })
    createdAt: Date;
}

export class AuthUserDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    userId: number;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    email: string;

    @ApiProperty({ enum: ['admin', 'staff', 'member'], description: 'User role' })
    role: UserRole;

    @ApiProperty({ example: 1, description: 'Member ID if user is a member', nullable: true })
    memberId: number | null;

    @ApiPropertyOptional({ type: MemberInfoDto, description: 'Member details if user is a member' })
    member?: MemberInfoDto;
}

export class LoginResponseDto {
    @ApiProperty({ description: 'JWT access token' })
    accessToken: string;

    @ApiProperty({ type: AuthUserDto, description: 'Authenticated user details' })
    user: AuthUserDto;
}
