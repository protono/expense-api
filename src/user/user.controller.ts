import {Controller, Get} from '@nestjs/common'
import {GetUserId} from '../auth/decorators'
import {UserService} from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(SessionGuard)
  @Get('me')
  getMe(@GetUserId() id: number) {
    return this.userService.getMe(id)
  }
}
