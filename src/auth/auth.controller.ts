import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common'
import {AuthService} from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('connect')
  connect() {
    return this.authService.connect()
  }

  @Post('register')
  register(@Body() body: any) {
    console.log({body})
    return this.authService.register()
  }
}
