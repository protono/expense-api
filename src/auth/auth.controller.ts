import {Body, Controller, HttpCode, HttpStatus, Post, Req} from '@nestjs/common'
import {AuthService} from './auth.service'
import {AuthDto} from './dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('connect')
  async connect(@Body() dto: AuthDto, @Req() req: any) {
    console.log({session: req.session})
    const {id, email} = await this.authService.connectUser(dto)
    req.session.user = {id, email}
    return this.authService.connectUser(dto)
  }

  @Post('register')
  register(@Body() dto: AuthDto) {
    return this.authService.registerUser(dto)
  }
}
/*  */
