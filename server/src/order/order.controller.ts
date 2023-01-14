import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CreateOrderDto } from './dto/create-order-dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/:companySlug')
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
}
