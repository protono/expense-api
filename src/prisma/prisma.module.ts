import {Module} from '@nestjs/common'
import {PrismaService} from './prisma.service'

@Module({
  providers: [PrismaService], // accessible inside this module
  exports: [PrismaService], // accessible outside
})
export class PrismaModule {}
