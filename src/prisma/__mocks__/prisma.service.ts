import {userStub} from '../../user/stubs'

export const PrismaService = jest.fn().mockReturnValue({
  user: {
    findUnique: jest.fn().mockResolvedValue(userStub()),
  },
})
