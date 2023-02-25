import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'body-parser';
import { raw } from 'express';

const port = process.env.PORT || 8000;

(BigInt.prototype as any).toJSON = function () {
  return Number(this);
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/payment-gateway/webhook', raw({ type: '*/*' }));

  app.use(json({ limit: '5mb' }));

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN.split(','),
  });

  await app.listen(port);
}

bootstrap();
