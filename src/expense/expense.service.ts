import {ForbiddenException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'

@Injectable()
export class ExpenseService {
  constructor(private prismaService: PrismaService) {}

  getExpenses(userId: number) {
    return this.prismaService.expense.findMany({
      where: {
        userId,
      },
    })
  }

  async getExpense(userId: number, expenseId: number) {
    const expense = await this.prismaService.expense.findFirst({where: {id: expenseId}})
    if (!expense) throw new NotFoundException(`Expense ${expenseId} does not exist`)
    if (expense.userId !== userId) throw new ForbiddenException(`Access to expense ${expenseId} is forbidden`)
    return expense
  }

  async createExpense(userId: number, dto: any) {}

  async updateExpense(userId: number, expenseId: number, dto: any) {}

  async deleteExpense(userId: number, expenseId: number) {}
}
