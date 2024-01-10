import {Test} from '@nestjs/testing'
import {SimpleService} from './simple.service'

describe('SimpleService', () => {
  let simpleService: SimpleService

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [SimpleService],
    }).compile()

    simpleService = module.get(SimpleService)
  })

  it('bootstrap', () => {
    expect(simpleService).toBeDefined()
  })

  afterAll(async () => {
    jest.restoreAllMocks()
  })

  describe('Method: testMe', () => {
    describe('when called', () => {
      let result: any

      beforeEach(async () => {
        result = simpleService.testMe(0)
      })

      it('should return a number', () => {
        expect(typeof result).toBe('number')
      })

      it('which should be incremented', () => {
        expect(result).toBe(1)
      })
    })
  })

  describe('Method: testMeWithMocks', () => {
    describe('when called', () => {
      let result: any

      beforeEach(async () => {
        jest.spyOn(simpleService, 'randomValue').mockReturnValue(1)
        result = simpleService.testMeWithMocks(0)
      })

      it('should return a number', () => {
        expect(typeof result).toBe('number')
      })

      it('which should be incremented', () => {
        expect(result).toBe(1)
      })

      test.skip('just a test', () => {
        jest.restoreAllMocks()
        console.log(simpleService.testMeWithMocks(0))
      })

      test('randomValue() should be called', () => {
        expect(simpleService.randomValue).toHaveBeenCalled()
        expect(simpleService.randomValue).toHaveReturnedWith(1)
      })
    })
  })
})
