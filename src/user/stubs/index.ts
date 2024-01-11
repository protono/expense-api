import {Role} from '@prisma/client'

const date = new Date()

export const userStub = () => ({
  id: 1,
  email: 'test@test.com',
  hash: 'hahahaha',
  initialBalance: 1000,
  currentBalance: 1000,
  role: Role.USER,
  createdAt: date,
  updatedAt: date,
})
