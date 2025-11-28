import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Platform {
    WEB = 'web',
    ANDROID = 'android',
    IOS = 'ios',
}

export class RegisterFcmTokenDto {
    @ApiProperty({ description: 'FCM device token' })
    @IsString()
    token: string;

    @ApiPropertyOptional({ description: 'Unique device identifier' })
    @IsString()
    @IsOptional()
    deviceId?: string;

    @ApiPropertyOptional({ enum: Platform, description: 'Device platform' })
    @IsEnum(Platform)
    @IsOptional()
    platform?: Platform;
}
