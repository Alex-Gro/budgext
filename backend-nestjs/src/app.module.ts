import {Module} from '@nestjs/common';
import {AuthModule} from "./auth/auth.module";
import {UserModule} from './user/user.module';
import {BookmarkModule} from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// TODO Implement config module in /src/ for erroring reasons (has to be string .. etc)