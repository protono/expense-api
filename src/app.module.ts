import {APP_GUARD} from '@nestjs/core'
import {AuthModule} from './auth/auth.module'
import {CacheModule} from '@nestjs/cache-manager'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {ExpenseModule} from './expense/expense.module'
import {Module} from '@nestjs/common'
import {PrismaModule} from './prisma/prisma.module'
import {RedisClientOptions} from 'redis'
import {redisStore} from 'cache-manager-redis-yet'
import {AdminGuard, SessionGuard} from './auth/guards'
import {UserModule} from './user/user.module'
import {SchedulerModuile} from './scheduler/scheduler.module'
import {ScheduleModule} from '@nestjs/schedule'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ExpenseModule,
    SchedulerModuile,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({isGlobal: true}),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 10000, // milliseconds
          url: configService.getOrThrow('REDIS_URL'),
          store: redisStore,
        }
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AdminGuard,
    },
  ],
})
export class AppModule {}
