import {AdminGuard, SessionGuard} from '../src/auth/guards'
import {APP_GUARD} from '@nestjs/core'
import {AuthDTO} from '../src/auth/dto'
import {AuthModule} from '../src/auth/auth.module'
import {CACHE_MANAGER, CacheModule} from '@nestjs/cache-manager'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {ExpenseModule} from '../src/expense/expense.module'
import {INestApplication, ValidationPipe} from '@nestjs/common'
import {PrismaModule} from '../src/prisma/prisma.module'
import {RedisClientOptions, RedisClientType, createClient} from 'redis'
import {redisStore} from 'cache-manager-redis-yet'
import {ScheduleModule} from '@nestjs/schedule'
import {SchedulerModuile} from '../src/scheduler/scheduler.module'
import {Test} from '@nestjs/testing'
import {UserModule} from '../src/user/user.module'
import * as request from 'supertest'
import * as session from 'express-session'
import RedisStore from 'connect-redis'
import {PrismaService} from '../src/prisma/prisma.service'

describe('App (e2e)', () => {
  let app: INestApplication
  let redisClient: RedisClientType
  let connectSid = ''

  beforeAll(async () => {
    // copied from app.module.ts - BEGIN
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
    // copied from app.module.ts - END

    app = module.createNestApplication()

    // copied from main.ts - BEGIN
    const configService = app.get(ConfigService)
    const prismaService = app.get(PrismaService)

    redisClient = createClient({
      url: configService.getOrThrow('REDIS_URL'),
    })
    redisClient.on('error', (err) => {
      console.log(`Error ${err} while connecting to Redis`)
    })
    await redisClient.connect().catch((error) => {
      throw error
    })

    app.use(
      session({
        secret: configService.getOrThrow('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
        store: new RedisStore({
          client: redisClient,
          ttl: 300, // seconds
        }),
      }),
    )

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    )
    // copied from main.ts - END

    await prismaService.cleanDb()
    await app.init()
  })

  afterAll(async () => {
    const cacheManager = app.get(CACHE_MANAGER)
    await cacheManager.store.client.quit()
    await redisClient.disconnect()
    app.close()
  })

  describe('[AppModule]', () => {
    it('should be defined', () => {
      expect(app).toBeDefined()
    })
  })

  describe('[auth]', () => {
    const dto: AuthDTO = {email: 'test@test.com', password: 'arcane'}

    describe('registerUser()', () => {
      it('registers a user', () => {
        return request(app.getHttpServer())
          .post('/auth/register')
          .send(dto)
          .expect(201)
          .expect('set-cookie', /connect.sid/)
          .expect(({header}) => {
            connectSid = header['set-cookie']
          })
      })
    })

    describe('connectUser()', () => {
      it('connects a user', () => {
        return request(app.getHttpServer())
          .post('/auth/connect')
          .send(dto)
          .expect(200)
          .expect('set-cookie', /connect.sid/)
      })
    })
  })

  describe('[user]', () => {
    describe('getMe()', () => {
      it('needs a session id', () => {
        return request(app.getHttpServer()).get('/user/me').expect(401)
      })

      it('gets a user', () => {
        return request(app.getHttpServer())
          .get('/user/me')
          .set('Cookie', connectSid)
          .expect(200)
          .expect(({body}) => {
            console.log(body)
          })
      })
    })
  })
})
