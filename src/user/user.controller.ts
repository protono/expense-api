import {Controller, Get, UseGuards} from '@nestjs/common'
import {SessionGuard} from '../auth/guards'
import {UserService} from './user.service'
import {GetUserId} from '../auth/decorators'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(SessionGuard)
  @Get('me')
  getMe(@GetUserId() id: number) {
    return this.userService.getMe(id)
  }
}
