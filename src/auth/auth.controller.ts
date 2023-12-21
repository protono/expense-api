import {Controller, Get, Post} from '@nestjs/common'
import {AuthService} from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('connect')
  connect() {
    return this.authService.connect()
  }

  @Post('register')
  register() {
    return this.authService.register()
  }
}
