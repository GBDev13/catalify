import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [OrderModule],
  providers: [TasksService],
})
export class TasksModule {}
