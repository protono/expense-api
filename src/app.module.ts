import {Module} from '@nestjs/common'
import {AuthModule} from './auth/auth.module'
import {PrismaModule} from './prisma/prisma.module'
import {UserModule} from './user/user.module'
import {APP_GUARD} from '@nestjs/core'
import {SessionGuard} from './auth/guards'
import {ExpenseModule} from './expense/expense.module'
import {CacheModule} from '@nestjs/cache-manager'
import {redisStore} from 'cache-manager-redis-yet'
import {RedisClientOptions} from 'redis'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {config} from 'process'

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ExpenseModule,
    ConfigModule.forRoot({isGlobal: true}),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          ttl: 20000,
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
  ],
})
export class AppModule {}
