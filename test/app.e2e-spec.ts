import {CACHE_MANAGER, CacheModule} from '@nestjs/cache-manager'
import {INestApplication} from '@nestjs/common'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {APP_GUARD} from '@nestjs/core'
import {ScheduleModule} from '@nestjs/schedule'
import {Test} from '@nestjs/testing'
import {redisStore} from 'cache-manager-redis-yet'
import {RedisClientOptions} from 'redis'
import {AuthModule} from '../src/auth/auth.module'
import {AdminGuard, SessionGuard} from '../src/auth/guards'
import {ExpenseModule} from '../src/expense/expense.module'
import {PrismaModule} from '../src/prisma/prisma.module'
import {SchedulerModuile} from '../src/scheduler/scheduler.module'
import {UserModule} from '../src/user/user.module'

describe('App (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
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
        ConfigModule.forRoot({isGlobal: true}),
        ExpenseModule,
        PrismaModule,
        ScheduleModule.forRoot(),
        SchedulerModuile,
        UserModule,
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
    }).compile()

    app = module.createNestApplication()
  })

  afterAll(async () => {
    const cacheManager = app.get(CACHE_MANAGER)
    await cacheManager.store.client.quit()
    app.close()
  })

  describe('[AppModule]', () => {
    it('should be defined', () => {
      expect(app).toBeDefined()
    })
  })
})
