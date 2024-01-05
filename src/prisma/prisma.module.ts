import {Global, Module} from '@nestjs/common'
import {PrismaService} from './prisma.service'
import {ConfigService} from '@nestjs/config'

@Global()
@Module({
  providers: [PrismaService, ConfigService], // accessible inside this module
  exports: [PrismaService], // accessible outside
})
export class PrismaModule {}
