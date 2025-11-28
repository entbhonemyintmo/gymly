import { Controller, Post, Get, Body, Query, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CheckInsService } from './checkins.service';
import {
    CheckInDto,
    CheckInDetailResponseDto,
    CheckInHistoryQueryDto,
    PaginatedCheckInHistoryDto,
    PaginatedCheckInHistoryWithMemberDto,
} from './dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthUserDto } from '../auth/dto';
import { UserRole, CheckInStatus } from '../../generated/prisma/client';

@ApiTags('Check-ins')
@Controller('checkins')
export class CheckInsController {
    constructor(private readonly checkInsService: CheckInsService) {}

    @Post()
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Check in a member',
        description: 'Members can check themselves in. Staff/Admin can check in any member by providing memberId.',
    })
    @ApiResponse({
        status: 201,
        description: 'Check-in processed successfully',
        type: CheckInDetailResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request - Invalid member ID' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - User not associated with a member' })
    @ApiResponse({ status: 404, description: 'Member not found' })
    async checkIn(@CurrentUser() user: AuthUserDto, @Body() dto: CheckInDto): Promise<CheckInDetailResponseDto> {
        let memberId: number;

        if (user.role === UserRole.member) {
            // Members can only check themselves in
            if (!user.memberId) {
                throw new ForbiddenException('User is not associated with a member account');
            }
            if (dto.memberId && dto.memberId !== user.memberId) {
                throw new ForbiddenException('Members can only check themselves in');
            }
            memberId = user.memberId;
        } else {
            // Staff/Admin must provide a memberId
            if (!dto.memberId) {
                throw new BadRequestException('Member ID is required for staff/admin check-in');
            }
            memberId = dto.memberId;
        }

        return this.checkInsService.checkIn(memberId);
    }

    @Get('me')
    @Roles(UserRole.member)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get my check-in history (members only)' })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: CheckInStatus,
        description: 'Filter by check-in status',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of check-in history',
        type: PaginatedCheckInHistoryDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Not a member' })
    async findMyCheckIns(
        @CurrentUser() user: AuthUserDto,
        @Query() query: CheckInHistoryQueryDto,
    ): Promise<PaginatedCheckInHistoryDto> {
        if (!user.memberId) {
            throw new ForbiddenException('User is not associated with a member account');
        }

        return this.checkInsService.findMyCheckIns(user.memberId, query);
    }

    @Get()
    @Roles(UserRole.admin, UserRole.staff)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all check-ins (admin/staff only)' })
    @ApiQuery({
        name: 'status',
        required: false,
        enum: CheckInStatus,
        description: 'Filter by check-in status',
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of all check-ins with member info',
        type: PaginatedCheckInHistoryWithMemberDto,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Admin/Staff access required' })
    async findAll(@Query() query: CheckInHistoryQueryDto): Promise<PaginatedCheckInHistoryWithMemberDto> {
        return this.checkInsService.findAll(query);
    }
}
