import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PackagesService } from './packages.service';
import { PackageDto } from './dto';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
    constructor(private readonly packagesService: PackagesService) {}

    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get all packages' })
    @ApiResponse({
        status: 200,
        description: 'List of all active packages',
        type: [PackageDto],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async findAll(): Promise<PackageDto[]> {
        return this.packagesService.findAll();
    }
}
