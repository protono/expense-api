import {Controller, Get, SetMetadata} from '@nestjs/common'
import {GetUserId} from '../auth/decorators'
import {UserService} from './user.service'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @SetMetadata('ADMIN_ROUTE', true)
  @Get('all')
  getAllUsers() {
    return this.userService.getAllUsers()
  }

  @Get('me')
  getMe(@GetUserId() id: number) {
    return this.userService.getMe(id)
  }
}
