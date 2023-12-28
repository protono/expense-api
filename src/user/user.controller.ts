import {Controller, Get, UseGuards} from '@nestjs/common'
import {SessionGuard} from '../auth/guards'

@Controller('user')
export class UserController {
  @UseGuards(SessionGuard)
  @Get()
  get() {
    return true
  }
}
