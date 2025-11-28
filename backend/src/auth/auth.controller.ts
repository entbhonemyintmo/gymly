import { Controller, Post, UseGuards, Body, HttpCode, HttpStatus, Get, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards';
import { Public } from './decorators';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto, LoginResponseDto, AuthUserDto } from './dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: LoginResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@CurrentUser() user: AuthUserDto): Promise<LoginResponseDto> {
        return this.authService.login(user);
    }

    @Get('me')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get current authenticated user with member info' })
    @ApiResponse({
        status: 200,
        description: 'Current user details including member info',
        type: AuthUserDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getMe(@CurrentUser() user: AuthUserDto): Promise<AuthUserDto> {
        const userWithMember = await this.authService.getUserWithMember(user.userId);
        if (!userWithMember) {
            throw new NotFoundException('User not found');
        }
        return userWithMember;
    }
}
