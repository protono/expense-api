import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthDto} from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('connect')
  connect(@Body() dto: AuthDto) {
    return this.authService.connectUser(dto)
  }

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.registerUser(dto)
  }
}
/*  */
