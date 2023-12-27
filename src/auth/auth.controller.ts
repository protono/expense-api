import {Body, Controller, HttpCode, HttpStatus, Post, Req, Session} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthDto} from './dto'
import {UserSession} from './types'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('connect')
  async connect(@Body() dto: AuthDto, @Session() session: UserSession) {
    console.log({session})
    const {id, email} = await this.authService.connectUser(dto)
    session.user = {id, email}
    return this.authService.connectUser(dto)
  }

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.registerUser(dto)
  }
}
/*  */
