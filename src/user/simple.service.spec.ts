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

  describe('Method: testMe', () => {
    describe('when called', () => {
      let result

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
})
