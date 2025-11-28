import { Catch, ExceptionFilter, ArgumentsHost, Logger, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

interface PrismaErrorResponse {
    statusCode: number;
    error: string;
    message: string;
}

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter<PrismaClientKnownRequestError> {
    private readonly logger = new Logger(PrismaExceptionFilter.name);

    catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        this.logger.error(`Prisma Error [${exception.code}]: ${exception.message}`);

        const errorResponse = this.buildErrorResponse(exception);

        response.status(errorResponse.statusCode).json(errorResponse);
    }

    private buildErrorResponse(exception: PrismaClientKnownRequestError): PrismaErrorResponse {
        const error = exception.message.replace(/\n/g, ' ').trim();

        const isDeleteOrUpdate = error.includes('delete()') || error.includes('update()');
        const isCreateOrUpdateOperation =
            error.includes('create()') ||
            error.includes('update()') ||
            error.includes('updateMany()') ||
            error.includes('createMany()') ||
            error.includes('createManyAndReturn()');

        switch (exception.code) {
            case 'P2002':
                return {
                    statusCode: HttpStatus.CONFLICT,
                    error: 'Conflict',
                    message: this.getUniqueConstraintMessage(exception),
                };

            case 'P2003':
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: isCreateOrUpdateOperation
                        ? 'Invalid reference: The related record does not exist'
                        : 'Cannot perform operation: Record is referenced by other records',
                };

            case 'P2025':
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    error: 'Not Found',
                    message: isDeleteOrUpdate
                        ? 'Record not found with the provided ID'
                        : 'The requested record was not found',
                };

            case 'P2014':
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'The operation violates a required relation',
                };

            case 'P2016':
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    error: 'Bad Request',
                    message: 'Invalid query parameters',
                };

            default:
                return {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    error: 'Internal Server Error',
                    message: 'An unexpected database error occurred',
                };
        }
    }

    private getUniqueConstraintMessage(exception: PrismaClientKnownRequestError): string {
        const target = exception.meta?.target as string[] | undefined;

        if (target && target.length > 0) {
            const fields = target.join(', ');
            return `A record with this ${fields} already exists`;
        }

        return 'A record with these unique fields already exists';
    }
}
