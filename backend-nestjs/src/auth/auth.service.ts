import { ForbiddenException, Injectable } from '@nestjs/common';
import {PrismaService} from '../prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService,
              private jwt: JwtService,
              private configService: ConfigService) {}

  async signUp(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    // save the new user in the db
    try {
      const user = await this.prismaService.$transaction(async (tx) => {
        const createdUser = await tx.user.create({
          data: {
            email: dto.email,
            hash,
          },
        });
        await tx.balance.create({
          data: {
            total: 0.0,
            userId: createdUser.id
          }
        });
        return createdUser;
      });
      // return the saved user
      return this.signToken(user.id, user.email);
    } catch(error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // Error Code for trying record with unique field (i.e. user.email) | can look it up in nestJS doc's
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      } else {
        throw error;
      }
    }
  }

  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email,
      }
    });
    // if user does not exist throw except
    if (!user) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    )
    // if password incorrect throw except
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    // send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{access_token: string}> {
    const payload = {
      sub: userId,
      email
    };

    const secret = this.configService.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret
    });

    return {
      access_token: token,
    };
  }
}