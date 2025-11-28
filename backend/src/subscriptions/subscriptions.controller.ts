import {
    Controller,
    Post,
    Get,
    Body,
    Query,
    Param,
    ParseIntPipe,
    ForbiddenException,
    UseInterceptors,
    UploadedFile,
    ParseFilePipe,
    MaxFileSizeValidator,
    FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
    ApiParam,
    ApiConsumes,
    ApiBody,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import {
    SubscribeDto,
    SubscribeResponseDto,
    MySubscriptionsQueryDto,
    PaginatedMySubscriptionsDto,
    SubscriptionsQueryDto,
    PaginatedSubscriptionsDto,
    DenySubscriptionDto,
    ApproveSubscriptionResponseDto,
    DenySubscriptionResponseDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUserDto } from '../auth/dto';
import { UserRole } from '../../generated/prisma/client';
import { UploadService } from '../upload';
import 'multer';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
    constructor(
        private readonly subscriptionsService: SubscriptionsService,
        private readonly uploadService: UploadService,
    ) {}

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
    @UseInterceptors(FileInterceptor('receipt'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Subscribe to a package (members only)' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['packageId', 'paidAmount'],
            properties: {
                packageId: { type: 'integer', example: 1, description: 'Package ID to subscribe to' },
                paidAmount: { type: 'integer', example: 5000, description: 'Amount paid in cents' },
                receipt: {
                    type: 'string',
                    format: 'binary',
                    description: 'Receipt image (JPEG, PNG, or WebP, max 5MB)',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Subscription created successfully',
        type: SubscribeResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not a member or package not active' })
    @ApiResponse({ status: 404, description: 'Package not found' })
    async subscribe(
        @CurrentUser() user: AuthUserDto,
        @Body() dto: SubscribeDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // 5MB
                    new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ }),
                ],
                fileIsRequired: false,
            }),
        )
        receipt?: Express.Multer.File,
    ): Promise<SubscribeResponseDto> {
        if (!user.memberId) {
            throw new ForbiddenException('User is not associated with a member account');
        }

        let receiptUrl: string | undefined;
        if (receipt) {
            receiptUrl = await this.uploadService.uploadFile(receipt, 'receipts');
        }

        return this.subscriptionsService.subscribe(user.memberId, dto, receiptUrl);
    }

    @Post(':id/approve')
    @Roles(UserRole.admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Approve a pending subscription (admin only)' })
    @ApiParam({ name: 'id', type: Number, description: 'Subscription ID' })
    @ApiResponse({
        status: 200,
        description: 'Subscription approved successfully',
        type: ApproveSubscriptionResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request - Subscription is not pending' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Subscription not found' })
    async approve(@Param('id', ParseIntPipe) id: number): Promise<ApproveSubscriptionResponseDto> {
        return this.subscriptionsService.approve(id);
    }

    @Post(':id/deny')
    @Roles(UserRole.admin)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deny a pending subscription (admin only)' })
    @ApiParam({ name: 'id', type: Number, description: 'Subscription ID' })
    @ApiResponse({
        status: 200,
        description: 'Subscription denied',
        type: DenySubscriptionResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request - Subscription is not pending' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
    @ApiResponse({ status: 404, description: 'Subscription not found' })
    async deny(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: DenySubscriptionDto,
    ): Promise<DenySubscriptionResponseDto> {
        return this.subscriptionsService.deny(id, dto);
    }
}
