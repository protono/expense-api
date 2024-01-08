import {Injectable} from '@nestjs/common'
import {Cron, CronExpression, Interval, Timeout} from '@nestjs/schedule'

@Injectable()
export class SchedulerService {
  @Cron(CronExpression.EVERY_5_SECONDS)
  scheduledTask() {
    console.log('Running scheduled task')
  }
}
