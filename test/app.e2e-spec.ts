import {AdminGuard, SessionGuard} from '../src/auth/guards'
import {APP_GUARD} from '@nestjs/core'
import {AuthDTO} from '../src/auth/dto'
import {AuthModule} from '../src/auth/auth.module'
import {CACHE_MANAGER, CacheModule} from '@nestjs/cache-manager'
import {ConfigModule, ConfigService} from '@nestjs/config'
import {CreateExpenseDTO, UpdateExpenseDTO} from '../src/expense/dto'
import {ExpenseModule} from '../src/expense/expense.module'
import {INestApplication, ValidationPipe} from '@nestjs/common'
import {PrismaModule} from '../src/prisma/prisma.module'
import {PrismaService} from '../src/prisma/prisma.service'
import {RedisClientOptions, RedisClientType, createClient} from 'redis'
import {redisStore} from 'cache-manager-redis-yet'
import {ScheduleModule} from '@nestjs/schedule'
import {SchedulerModuile} from '../src/scheduler/scheduler.module'
import {Test} from '@nestjs/testing'
import {UserModule} from '../src/user/user.module'
import * as request from 'supertest'
import * as session from 'express-session'
import RedisStore from 'connect-redis'

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
    const dto: AuthDTO = {email: 'test@test.com', password: 'arcane'}

    describe('getMe()', () => {
      it('needs a session id', () => {
        return request(app.getHttpServer()).get('/user/me').expect(401)
      })

      it('gets a user', async () => {
        const resp = await request(app.getHttpServer()).get('/user/me').set('Cookie', connectSid).expect(200)
        expect(resp.body.email).toEqual(dto.email)
      })
    })
  })

  describe('[expense]', () => {
    let expenseId: number

    describe('createExpense()', () => {
      it('creates 2 expenses', async () => {
        const expense_1: CreateExpenseDTO = {
          title: 'Expense 1',
          amount: '20',
          description: 'This is the 1st expense',
          date: new Date(),
        }

        const resp = await request(app.getHttpServer())
          .post('/expense')
          .set('Cookie', connectSid)
          .send(expense_1)
          .expect(201)

        expenseId = resp.body.id

        const expense_2: CreateExpenseDTO = {
          title: 'Expense 2',
          amount: '10',
          description: 'This is the 2nd expense',
          date: new Date(),
        }

        await request(app.getHttpServer()).post('/expense').set('Cookie', connectSid).send(expense_2).expect(201)
      })
    })

    describe('getExpenses()', () => {
      it("gets all user's expenses", async () => {
        const resp = await request(app.getHttpServer()).get('/expense').set('Cookie', connectSid).expect(200)

        expect(resp.body).toEqual(
          expect.objectContaining({
            data: expect.any(Array),
            count: 2, // use wrong count for a bug
            hasMore: false,
          }),
        )
      })
    })

    describe('getExpense()', () => {
      it('finds an expense by Id', async () => {
        const resp = await request(app.getHttpServer())
          .get(`/expense/${expenseId}`)
          .set('Cookie', connectSid)
          .expect(200)

        expect(resp.body.id).toBeTruthy()
      })

      it('404s with unknown Id', async () => {
        const resp = await request(app.getHttpServer()).get('/expense/0').set('Cookie', connectSid).expect(404)

        expect(resp.body.message).toBe(`Expense 0 does not exist`)
      })
    })

    describe('updateExpense()', () => {
      it('updates an expense by Id', async () => {
        const update: UpdateExpenseDTO = {
          title: 'Expense 1 (UPDATED)',
          description: 'This is the 1st expense (UPDATED)',
        }

        const resp = await request(app.getHttpServer())
          .patch(`/expense/${expenseId}`)
          .set('Cookie', connectSid)
          .send(update)
          .expect(200)

        expect(resp.body.title).toMatch(/(UPDATED)/)
        expect(resp.body.description).toMatch(/(UPDATED)/)
      })
    })
    function timeout(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms))
    }

    describe('deleteExpense()', () => {
      it('deletes an expense by Id', async () => {
        await request(app.getHttpServer()).delete(`/expense/${expenseId}`).set('Cookie', connectSid).expect(204)

        await request(app.getHttpServer()).get(`/expense/${expenseId}`).set('Cookie', connectSid).expect(404)
      })
    })
  })
})
