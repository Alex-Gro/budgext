import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto): Promise<User | undefined> {
    const user = await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      }
    });
    delete user.hash;
    return user;
  }

  async deleteUser(userId: number): Promise<boolean> {
    // TODO Logik für User Deletion --> Alle mit dem User assoziierten Entitäten müssen auch gelöscht werden
    const balance = await this.prismaService.balance.findUnique({
      where: {
        userId,
      }
    })
    // TODO Delete balance
    const transactions = await this.prismaService.transaction.findMany({
      where: {
        userId,
      }
    });
    // TODO Delete all transactions

    //TODO Or should a user deletion just trigger db to delete all associations?
    return true;
  }

}
