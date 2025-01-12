import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { JwtPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {

  constructor(configService: ConfigService,
              private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  // TODO Do I need JwtPayload | or is .sub: number enough? email is not used here?!
  // (method) JwtStrategy.validate(payload: any): any
  async validate(payload: JwtPayload): Promise<User | null> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user) { return null } // return null throws 401, Unauthorized (user could not be found)

      delete user.password;
      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token or user not found!')
    }
  }
}