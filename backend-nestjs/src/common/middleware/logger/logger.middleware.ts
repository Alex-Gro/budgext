import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Example loggermiddleware only used while AuthController is playing...', new Date().toDateString())
    console.log(`This is req ${req}`)
    console.log(`This is res ${res}`)
    next();
  }
}
