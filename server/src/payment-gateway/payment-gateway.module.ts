import { Module } from '@nestjs/common';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGatewayController } from './payment-gateway.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { LogModule } from 'src/log/log.module';

@Module({
  imports: [PrismaModule, SubscriptionModule, LogModule],
  controllers: [PaymentGatewayController],
  providers: [PaymentGatewayService],
})
export class PaymentGatewayModule {}
