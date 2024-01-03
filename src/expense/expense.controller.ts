import {Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common'
import {ExpenseService} from './expense.service'
import {GetUserId} from '../auth/decorators'
import {CreateExpenseDTO, UpdateExpenseDTO} from './dto'

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  getExpenses(@GetUserId() userId: number) {
    return this.expenseService.getExpenses(userId)
  }

  @Get(':id')
  getExpense(@GetUserId() userId: number, @Param('id') expenseId: number) {
    return this.expenseService.getExpense(userId, expenseId)
  }

  @Post()
  createExpense(@GetUserId() userId: number, dto: CreateExpenseDTO) {
    return this.expenseService.createExpense(userId, dto)
  }

  @Patch(':id')
  updateExpense(@GetUserId() userId: number, @Param('id') expenseId: number, dto: UpdateExpenseDTO) {
    return this.expenseService.updateExpense(userId, expenseId, dto)
  }

  @Delete(':id')
  deleteExpense(@GetUserId() userId: number, @Param('id') expenseId: number) {
    return this.expenseService.deleteExpense(userId, expenseId)
  }
}
