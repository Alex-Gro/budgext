import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true // tripping out elements that are not defined while using pipe | auth.dto.ts signin email, password but nothing else can pass through
  }));
  await app.listen(3333);
}
bootstrap();
