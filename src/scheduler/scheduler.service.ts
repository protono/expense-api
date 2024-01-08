import {Injectable, Logger} from '@nestjs/common'
import {Cron, CronExpression, Interval, Timeout} from '@nestjs/schedule'
import {PrismaService} from '../prisma/prisma.service'
import {Expense} from '@prisma/client'

@Injectable()
export class SchedulerService {
  constructor(private prismaService: PrismaService) {}

  private logger = new Logger(SchedulerService.name)

  @Cron('*/30 * * * * *') // EVERY_30_SECONDS
  async calculateCurrentBalance() {
    const users = await this.prismaService.user.findMany({
      include: {
        expenses: true,
      },
    })
    for (const user of users) {
      const totalExpenses = user.expenses.reduce((prev: number, next: Expense) => {
        return prev + +next.amount
      }, 0)

      if (user.initialBalance - totalExpenses >= user.currentBalance) continue

      await this.prismaService.user
        .update({
          where: {
            id: user.id,
          },
          data: {
            currentBalance: user.initialBalance - totalExpenses,
          },
        })
        .catch((error) => {
          this.logger.error(error)
        })
    }

    this.logger.log(`calculateCurrentBalance() ran for ${users.length} users`)
  }
}
