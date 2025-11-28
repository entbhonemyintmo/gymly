import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { JwtPayloadWithTimestamps, AuthUserDto } from '../dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is not defined');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: JwtPayloadWithTimestamps): Promise<AuthUserDto> {
        const user = await this.authService.validateUserById(payload.sub);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return {
            userId: payload.sub,
            email: payload.email,
            role: payload.role,
            memberId: payload.memberId,
        };
    }
}
