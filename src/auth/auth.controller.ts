import {Body, Controller, HttpCode, HttpStatus, Post, Session} from '@nestjs/common'
import {AuthService} from './auth.service'
import {PublicRoute} from './decorators'
import {AuthDTO} from './dto'
import {UserSession} from './types'

@PublicRoute()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private serializeSession(session: UserSession, id: number, email: string) {
    session.user = {id, email}
  }

  @HttpCode(HttpStatus.OK)
  @Post('connect')
  async connect(@Body() dto: AuthDTO, @Session() session: UserSession) {
    const {id, email} = await this.authService.connectUser(dto)
    this.serializeSession(session, id, email)
  }

  @Post('register')
  async register(@Body() dto: AuthDTO, @Session() session: UserSession) {
    const {id, email} = await this.authService.registerUser(dto)
    this.serializeSession(session, id, email)
  }
}
