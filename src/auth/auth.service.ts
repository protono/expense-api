import {Injectable} from '@nestjs/common'

@Injectable()
export class AuthService {
  register() {
    return {
      status: 200,
      name: this.register.name,
    }
  }

  connect() {
    return {
      status: 200,
      name: this.connect.name,
    }
  }
}
