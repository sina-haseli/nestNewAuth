import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions as MSOptions } from '@nestjs/microservices';
import { microServiceOptions } from './config/redis.config';
import { useContainer } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // await app.connectMicroservice<MSOptions>(microServiceOptions);
  await app.startAllMicroservicesAsync();
  await app.listen(1337);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
}
bootstrap();
