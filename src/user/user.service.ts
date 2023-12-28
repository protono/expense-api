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
}
