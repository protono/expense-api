import {Global, Module} from '@nestjs/common'
import {PrismaService} from './prisma.service'

@Global()
@Module({
  providers: [PrismaService], // accessible inside this module
  exports: [PrismaService], // accessible outside
})
export class PrismaModule {}
