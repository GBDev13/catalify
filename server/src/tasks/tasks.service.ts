import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class TasksService {
  constructor(private readonly orderService: OrderService) {}

  @Cron(CronExpression.EVERY_WEEK)
  async handleCron() {
    await this.orderService.expireOrders();
  }
}
