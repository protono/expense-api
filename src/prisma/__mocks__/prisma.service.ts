import {userStub, userWithExpensesStub} from '../../user/stubs'

export const PrismaService = jest.fn().mockReturnValue({
  user: {
    findUnique: jest.fn().mockResolvedValue(userStub()),
    findMany: jest.fn().mockResolvedValue(userWithExpensesStub()),
  },
})
