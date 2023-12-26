import {ForbiddenException, Injectable} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'
import {AuthDto} from './dto'
import * as argon2 from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async registerUser(dto: AuthDto) {
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
      msg: 'User registered',
      user: dto.email,
      userId: user.id,
    }
  }

  async connectUser(dto: AuthDto) {
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
      msg: 'User connected',
      user: dto.email,
    }
  }
}
