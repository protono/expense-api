import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common'
import {PrismaService} from '../prisma/prisma.service'
import {CreateExpenseDTO, UpdateExpenseDTO} from './dto'

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
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id: expenseId,
      },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    })
    if (!expense) throw new NotFoundException(`Expense ${expenseId} does not exist`)
    if (expense.userId !== userId) throw new ForbiddenException(`Access to expense ${expenseId} is forbidden`)
    return expense
  }

  async createExpense(userId: number, dto: CreateExpenseDTO) {
    const expense = await this.prismaService.expense.create({
      data: {
        userId,
        ...dto,
      },
    })
    return expense
  }

  async updateExpense(userId: number, expenseId: number, dto: UpdateExpenseDTO) {
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id: expenseId,
      },
    })
    if (!expense) throw new NotFoundException(`Expense ${expenseId} does not exist`)
    if (expense.userId !== userId) throw new ForbiddenException(`Access to expense ${expenseId} is forbidden`)
    const update = this.prismaService.expense.update({
      where: {
        id: expenseId,
      },
      data: dto,
    })
    return update
  }

  async deleteExpense(userId: number, expenseId: number) {
    const expense = await this.prismaService.expense.findFirst({
      where: {
        id: expenseId,
      },
    })
    if (!expense) throw new NotFoundException(`Expense ${expenseId} does not exist`)
    if (expense.userId !== userId) throw new ForbiddenException(`Access to expense ${expenseId} is forbidden`)
    await this.prismaService.expense.delete({
      where: {
        id: expenseId,
      },
    })
    return expense
  }
}
