import { Body, Controller, Get, Headers, Post, Query } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { PaymentGatewayService } from './payment-gateway.service';

@Controller('payment-gateway')
export class PaymentGatewayController {
  constructor(private readonly paymentGatewayService: PaymentGatewayService) {}

  @Get('/subscription/checkout')
  createSubscriptionCheckout(@Query('customerEmail') customerEmail: string) {
    return this.paymentGatewayService.createSubscriptionCheckout(customerEmail);
  }

  @Post('/webhook')
  @IsPublic()
  paymentWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentGatewayService.handleWebhook(rawBody, signature);
  }
}
