import {ForbiddenException, Injectable} from '@nestjs/common'
import * as argon2 from 'argon2'
import {PrismaService} from '../prisma/prisma.service'
import {AuthDTO} from './dto'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async registerUser(dto: AuthDTO) {
    // throw if email is in use
    const userExists = await this.prismaService.user.findUnique({where: {email: dto.email}})
    // console.log({userExists})
    if (userExists) {
      throw new ForbiddenException('The request did not succeed')
    }

    // hash the password
    const hash = await argon2.hash(dto.password)

    // create the user
    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash,
      },
    })

    return {
      id: user.id,
      email: user.email,
    }
  }

  async connectUser(dto: AuthDTO) {
    // throw if email is not in use
    const user = await this.prismaService.user.findUnique({where: {email: dto.email}})
    // console.log({user})
    if (!user) {
      throw new ForbiddenException('The request did not succeed')
    }

    // throw if password cannot be vberified
    const match = await argon2.verify(user.hash, dto.password)
    if (!match) {
      throw new ForbiddenException('The request did not succeed')
    }

    return {
      id: user.id,
      email: user.email,
    }
  }
}
