import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import 'multer';

@Injectable()
export class UploadService {
    private s3Client: S3Client;
    private bucketName: string;
    private region: string;

    constructor(private configService: ConfigService) {
        this.region = this.configService.getOrThrow<string>('AWS_REGION');
        this.bucketName = this.configService.getOrThrow<string>('AWS_S3_BUCKET');

        this.s3Client = new S3Client({
            region: this.region,
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async uploadFile(file: Express.Multer.File, folder: string = 'receipts'): Promise<string> {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        try {
            await this.s3Client.send(command);
            return `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;
        } catch (error) {
            console.error('S3 upload error:', error);
            throw new InternalServerErrorException('Failed to upload file to S3');
        }
    }
}
