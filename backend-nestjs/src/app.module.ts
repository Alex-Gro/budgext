import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {AuthModule} from "./auth/auth.module";
import {UserModule} from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { AuthController } from './auth/auth.controller';
import { BalanceModule } from './balance/balance.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    BalanceModule,
    TransactionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // TODO Use it wisely - this is just testing
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(AuthController);
  }
}

// TODO Implement config module in /src/ for erroring reasons (has to be string .. etc)