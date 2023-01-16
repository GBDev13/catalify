import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [PrismaModule, SubscriptionModule],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService],
})
export class PaymentGatewayModule {}
