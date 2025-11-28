import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PackageDto } from './dto';

@Injectable()
export class PackagesService {
    constructor(private readonly prisma: PrismaService) {}

    async findAll(): Promise<PackageDto[]> {
        return this.prisma.package.findMany({
            where: { isActive: true },
            orderBy: { price: 'asc' },
        });
    }
}
