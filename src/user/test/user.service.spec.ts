import {Test} from '@nestjs/testing'
import {User} from '@prisma/client'
import {PrismaService} from '../../prisma/prisma.service'
import {UserService} from '../user.service'
import {userStub} from '../stubs'

describe('[UserService]', () => {
  let userService: UserService
  let prismaService: PrismaService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockResolvedValue(userStub()),
            },
          },
        },
      ],
    }).compile()

    userService = module.get(UserService)
    prismaService = module.get(PrismaService)
  })

  afterAll(async () => {
    jest.restoreAllMocks()
  })

  it('bootstrap', () => {
    expect(userService).toBeDefined()
  })

  describe('getMe()', () => {
    describe('- when called', () => {
      let result: User

      beforeEach(async () => {
        result = await userService.getMe(userStub().id)
      })

      it('returns a user', async () => {
        const user = userStub()
        delete user.hash
        expect(result).toMatchObject(user)
      })

      it('has removed the hash', () => {
        expect(result.hash).toBeUndefined()
      })

      it('findUnique() is called', () => {
        expect(prismaService.user.findUnique).toHaveBeenCalledWith({
          where: {
            id: userStub().id,
          },
        })
        expect(prismaService.user.findUnique).toHaveReturnedWith(Promise.resolve(userStub()))
      })
    })
  })
})
