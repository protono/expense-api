import {Test} from '@nestjs/testing'
import {AuthModule} from '../src/auth/auth.module'
import {PrismaModule} from '../src/prisma/prisma.module'
import {UserModule} from '../src/user/user.module'
import {ExpenseModule} from '../src/expense/expense.module'
import {SchedulerModuile} from '../src/scheduler/scheduler.module'
import {ScheduleModule} from '@nestjs/schedule'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {CacheModule} from '@nestjs/cache-manager'
import {RedisClientOptions} from 'redis'
import {redisStore} from 'cache-manager-redis-yet'
import {APP_GUARD} from '@nestjs/core'
import {AdminGuard, SessionGuard} from '../src/auth/guards'
import {INestApplication} from '@nestjs/common'

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

  afterAll(() => {
    app.close()
  })

  describe('[AppModule]', () => {
    it('should be defined', () => {
      expect(app).toBeDefined()
    })
  })
})
