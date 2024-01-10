import {Injectable} from '@nestjs/common'

@Injectable()
export class SimpleService {
  testMe(value: number) {
    return ++value
  }

  testMeWithMocks(value: number) {
    return Math.round(Math.random() * 100) + value
  }
}
