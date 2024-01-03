import {Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common'
import {ExpenseService} from './expense.service'
import {GetUserId} from '../auth/decorators'

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  getExpenses(@GetUserId() id: number) {
    return this.expenseService.getExpenses(id)
  }

  @Get(':id')
  getExpense(@GetUserId() id: number, @Param('id') expenseId: number) {
    return this.expenseService.getExpense(id, expenseId)
  }

  @Post()
  createExpense(@GetUserId() id: number) {}

  @Patch(':id')
  updateExpense(@GetUserId() id: number) {}

  @Delete(':id')
  deleteExpense(@GetUserId() id: number) {}
}
