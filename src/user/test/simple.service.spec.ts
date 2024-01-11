import {Test} from '@nestjs/testing'
import {SimpleService} from '../simple.service'

describe('[SimpleService]', () => {
  let simpleService: SimpleService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [SimpleService],
    }).compile()

    simpleService = module.get(SimpleService)
  })

  afterAll(async () => {
    jest.restoreAllMocks()
  })

  it('bootstrap', () => {
    expect(simpleService).toBeDefined()
  })

  describe('testMe()', () => {
    describe('- when called', () => {
      let result: any

      beforeEach(async () => {
        result = simpleService.testMe(0)
      })

      it('returns a number', () => {
        expect(typeof result).toBe('number')
      })

      it('which is incremented', () => {
        expect(result).toBe(1)
      })
    })
  })

  describe('testMeWithMocks()', () => {
    describe('- when called', () => {
      let result: any

      beforeEach(async () => {
        jest.spyOn(simpleService, 'randomValue').mockReturnValue(1)
        result = simpleService.testMeWithMocks(0)
      })

      it('returns a number', () => {
        expect(typeof result).toBe('number')
      })

      it('which is incremented', () => {
        expect(result).toBe(1)
      })

      it.skip('just a test', () => {
        jest.restoreAllMocks()
        console.log(simpleService.testMeWithMocks(0))
      })

      it('randomValue() is called', () => {
        expect(simpleService.randomValue).toHaveBeenCalled()
        expect(simpleService.randomValue).toHaveReturnedWith(1)
      })
    })
  })
})
