import {Body, Controller, Delete, Get, Param, Patch, Post, Query} from '@nestjs/common'
import {ExpenseService} from './expense.service'
import {GetUserId} from '../auth/decorators'
import {CreateExpenseDTO, UpdateExpenseDTO} from './dto'
import {PageDTO} from '../common/dto'

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  getExpenses(@GetUserId() userId: number, @Query() dto: PageDTO) {
    return this.expenseService.getExpenses(userId, dto)
  }

  @Get(':id')
  getExpense(@GetUserId() userId: number, @Param('id') expenseId: number) {
    return this.expenseService.getExpense(userId, expenseId)
  }

  @Post()
  createExpense(@GetUserId() userId: number, @Body() dto: CreateExpenseDTO) {
    return this.expenseService.createExpense(userId, dto)
  }

  @Patch(':id')
  updateExpense(@GetUserId() userId: number, @Param('id') expenseId: number, @Body() dto: UpdateExpenseDTO) {
    return this.expenseService.updateExpense(userId, expenseId, dto)
  }

  @Delete(':id')
  deleteExpense(@GetUserId() userId: number, @Param('id') expenseId: number) {
    return this.expenseService.deleteExpense(userId, expenseId)
  }
}
