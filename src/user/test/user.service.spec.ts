import {Test} from '@nestjs/testing'
import {UserService} from '../user.service'
import {PrismaModule} from '../../prisma/prisma.module'
import {Role} from '@prisma/client'
import {PrismaService} from '../../prisma/prisma.service'

describe('UserService', () => {
  let userService: UserService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                email: 'test@test.com',
                hash: 'hahahaha',
                initialBalance: 1000,
                currentBalance: 1000,
                role: Role.USER,
                createdAt: new Date(),
                updatedAt: new Date(),
              }),
            },
          },
        },
      ],
    }).compile()

    userService = module.get(UserService)
  })

  afterAll(async () => {
    jest.restoreAllMocks()
  })

  it('bootstrap', () => {
    expect(userService).toBeDefined()
  })

  describe('Method: getMe', () => {
    describe('', () => {
      let result: any

      beforeEach(async () => {})

      it('test', async () => {
        const val = await userService.getMe(1)
        console.log(val)
      })
    })
  })
})
