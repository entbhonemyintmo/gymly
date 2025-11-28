import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { JwtPayload, LoginResponseDto, AuthUserDto } from './dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(email: string, password: string): Promise<AuthUserDto | null> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return null;
        }

        const isPasswordValid = await argon2.verify(user.passwordHash, password);

        if (!isPasswordValid) {
            return null;
        }

        return {
            userId: user.id,
            email: user.email,
            role: user.role,
            memberId: user.memberId,
        };
    }

    async login(user: AuthUserDto): Promise<LoginResponseDto> {
        const payload: JwtPayload = {
            sub: user.userId,
            email: user.email,
            role: user.role,
            memberId: user.memberId,
        };

        return {
            accessToken: this.jwtService.sign(payload),
            user,
        };
    }

    async validateUserById(userId: number): Promise<AuthUserDto | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return null;
        }

        return {
            userId: user.id,
            email: user.email,
            role: user.role,
            memberId: user.memberId,
        };
    }
}
