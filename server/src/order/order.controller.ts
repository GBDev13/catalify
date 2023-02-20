import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/:companySlug')
  @IsPublic()
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Param('companySlug') companySlug: string,
  ) {
    return this.orderService.createOrder(companySlug, createOrderDto);
  }

  @IsPublic()
  @Get('/:orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrderById(orderId);
  }

  @Patch('/:orderId/complete')
  async completeOrder(
    @Param('orderId') orderId: string,
    @CurrentUser() user: User,
  ) {
    return this.orderService.completeOrder(orderId, user);
  }

  @Get('/:companyId/all')
  async getAllOrders(@Param('companyId') companyId: string) {
    return this.orderService.getAllOrders(companyId);
  }
}
