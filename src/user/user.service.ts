import {Injectable} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getMe(userId: number) {
    const user = await this.prismaService.user.findUnique({where: {id: userId}})
    delete user.hash

    return user
  }

  async getAllUsers() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        _count: {
          select: {
            expenses: true,
          },
        },
      },
    })
  }
}
