import {Controller, Get, Session, UseGuards} from '@nestjs/common'
import {SessionGuard} from '../auth/guards'
import {UserService} from './user.service'
import {UserSession} from '../auth/types'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(SessionGuard)
  @Get('me')
  getMe(@Session() session: UserSession) {
    return this.userService.getMe(session.user.id)
  }
}
