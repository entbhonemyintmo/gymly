import { Controller, Post, Get, Body, Query, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import {
    SubscribeDto,
    SubscribeResponseDto,
    MySubscriptionsQueryDto,
    PaginatedMySubscriptionsDto,
    SubscriptionsQueryDto,
    PaginatedSubscriptionsDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUserDto } from '../auth/dto';
import { UserRole } from '../../generated/prisma/client';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(private readonly subscriptionsService: SubscriptionsService) {}

    @Get()
    @Roles(UserRole.admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all subscriptions with subscriber info (admin only)' })
    @ApiQuery({
        name: 'orderStatus',
        required: false,
        enum: ['pending', 'approved', 'rejected'],
        description: 'Filter by order status',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of subscriptions with subscriber information',
        type: PaginatedSubscriptionsDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    async findAll(@Query() query: SubscriptionsQueryDto): Promise<PaginatedSubscriptionsDto> {
        return this.subscriptionsService.findAll(query);
    }

    @Get('me')
    @Roles(UserRole.member)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Get current user's subscriptions (members only)" })
    @ApiQuery({
        name: 'orderStatus',
        required: false,
        enum: ['pending', 'approved', 'rejected'],
        description: 'Filter by order status',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({
        status: 200,
        description: "Paginated list of user's subscriptions with order information",
        type: PaginatedMySubscriptionsDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not a member' })
    async findMySubscriptions(
        @CurrentUser() user: AuthUserDto,
        @Query() query: MySubscriptionsQueryDto,
    ): Promise<PaginatedMySubscriptionsDto> {
        if (!user.memberId) {
            throw new ForbiddenException('User is not associated with a member account');
        }

        return this.subscriptionsService.findMySubscriptions(user.memberId, query);
    }

    @Post('subscribe')
    @Roles(UserRole.member)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Subscribe to a package (members only)' })
    @ApiResponse({
        status: 201,
        description: 'Subscription created successfully',
        type: SubscribeResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not a member or package not active' })
    @ApiResponse({ status: 404, description: 'Package not found' })
    async subscribe(@CurrentUser() user: AuthUserDto, @Body() dto: SubscribeDto): Promise<SubscribeResponseDto> {
        if (!user.memberId) {
            throw new ForbiddenException('User is not associated with a member account');
        }

        return this.subscriptionsService.subscribe(user.memberId, dto);
    }
}
