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

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    ExpenseModule,
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      ttl: 20000,
      url: 'redis://localhost:6379',
      store: redisStore,
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
