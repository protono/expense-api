import {Expense, Role} from '@prisma/client'

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

export const userWithExpensesStub = () => ({
  userStub,
  expenses: [
    {
      id: 1,
      amount: '100',
    },
    {
      id: 2,
      amount: '20',
    },
    {
      id: 3,
      amount: '50',
    },
  ] as Expense[],
})
