import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true // tripping out elements that are not defined while using pipe | auth.dto.ts signin email, password but nothing else can pass through
  }));
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));
}
bootstrap();
