import {Injectable} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  getMe(userId: number) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    })
  }
}
