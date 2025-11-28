import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors();

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    );

    const logger = new Logger('Main');
    logger.log('Starting Gymly API...');

    const config = new DocumentBuilder()
        .setTitle('Gymly API')
        .setDescription('Gymly gym management API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ?? 3000);

    logger.log(`API is running on port ${process.env.PORT ?? 3000}`);
    logger.log(`API documentation is available at http://localhost:${process.env.PORT ?? 3000}/docs`);
}
bootstrap();
