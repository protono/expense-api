import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import {ExpenseService} from './expense.service'
import {GetUserId} from '../auth/decorators'
import {CreateExpenseDTO, UpdateExpenseDTO} from './dto'
import {PageDTO} from '../common/dto'
import {CacheInterceptor, CacheTTL} from '@nestjs/cache-manager'

@Controller('expense')
export class ExpenseController {
  constructor(private expenseService: ExpenseService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  // @CacheTTL(5000)
  getExpenses(@GetUserId() userId: number, @Query() dto: PageDTO) {
    return this.expenseService.getExpenses(userId, dto)
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteExpense(@GetUserId() userId: number, @Param('id') expenseId: number) {
    return this.expenseService.deleteExpense(userId, expenseId)
  }
}
