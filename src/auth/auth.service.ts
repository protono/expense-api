import {Injectable} from '@nestjs/common'
import {AuthDto} from './dto'
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  registerUser(dto: AuthDto) {
    // 1. get email & password
    // 2. throw if email is in use
    // 3. hash the password
    // 4. save the user data
    return {
      status: 201,
      name: this.registerUser.name,
      dto,
    }
  }

  connectUser() {
    return {
      status: 200,
      name: this.connectUser.name,
    }
  }
}
