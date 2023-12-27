import {Body, Controller, HttpCode, HttpStatus, Post, Req, Session} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthDto} from './dto'
import {UserSession} from './types'
import {SessionGuard} from './guards'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private serializeSession(session: UserSession, id: number, email: string) {
    session.user = {id, email}
  }

  @HttpCode(HttpStatus.OK)
  @Post('connect')
  async connect(@Body() dto: AuthDto, @Session() session: UserSession) {
    const {id, email} = await this.authService.connectUser(dto)
    this.serializeSession(session, id, email)
  }

  @Post('register')
  async register(@Body() dto: AuthDto, @Session() session: UserSession) {
    const {id, email} = await this.authService.registerUser(dto)
    this.serializeSession(session, id, email)
  }
}
/*  */
