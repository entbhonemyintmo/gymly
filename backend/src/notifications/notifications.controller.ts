import { Controller, Get, Post, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../auth/decorators';
import { AuthUserDto } from '../auth/dto';
import {
    RegisterFcmTokenDto,
    NotificationsQueryDto,
    PaginatedNotificationsDto,
    MarkAsReadDto,
    UnreadCountDto,
} from './dto';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Post('fcm-token')
    @ApiOperation({ summary: 'Register FCM token for push notifications' })
    @ApiResponse({ status: 201, description: 'Token registered successfully' })
    async registerFcmToken(@CurrentUser() user: AuthUserDto, @Body() dto: RegisterFcmTokenDto) {
        return this.notificationsService.registerFcmToken(user.userId, dto);
    }

    @Delete('fcm-token/:token')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Remove FCM token (logout/unsubscribe)' })
    @ApiResponse({ status: 200, description: 'Token removed successfully' })
    async removeFcmToken(@Param('token') token: string) {
        return this.notificationsService.removeFcmToken(token);
    }

    @Get()
    @ApiOperation({ summary: 'Get user notifications' })
    @ApiResponse({ status: 200, type: PaginatedNotificationsDto })
    async getNotifications(
        @CurrentUser() user: AuthUserDto,
        @Query() query: NotificationsQueryDto,
    ): Promise<PaginatedNotificationsDto> {
        return this.notificationsService.getNotifications(user.userId, query);
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread notifications count' })
    @ApiResponse({ status: 200, type: UnreadCountDto })
    async getUnreadCount(@CurrentUser() user: AuthUserDto): Promise<UnreadCountDto> {
        return this.notificationsService.getUnreadCount(user.userId);
    }

    @Post('mark-read')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Mark specific notifications as read' })
    @ApiResponse({ status: 200, description: 'Notifications marked as read' })
    async markAsRead(@CurrentUser() user: AuthUserDto, @Body() dto: MarkAsReadDto) {
        return this.notificationsService.markAsRead(user.userId, dto.notificationIds);
    }

    @Post('mark-all-read')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({ status: 200, description: 'All notifications marked as read' })
    async markAllAsRead(@CurrentUser() user: AuthUserDto) {
        return this.notificationsService.markAllAsRead(user.userId);
    }
}
