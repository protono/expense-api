import {Test} from '@nestjs/testing'
import {SchedulerService} from '../scheduler.service'
import {PrismaService} from '../../prisma/prisma.service'
import {userWithExpensesStub} from '../../user/stubs'

jest.mock('../../prisma/prisma.service.ts')

describe('[SchedulerService]', () => {
  let schedulerService: SchedulerService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [SchedulerService, PrismaService],
    }).compile()

    schedulerService = module.get(SchedulerService)
  })

  it('bootstrap', () => {
    expect(schedulerService).toBeDefined()
  })

  describe('totalExpenses()', () => {
    describe('- when called', () => {
      let result: number

      beforeEach(async () => {
        result = schedulerService.totalExpenses(userWithExpensesStub().expenses)
      })

      it('returns the correct total', () => {
        expect(result).toEqual(170)
      })
    })
  })
})
