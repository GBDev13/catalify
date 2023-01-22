import { Module } from '@nestjs/common';
import { LinksPageModule } from 'src/links-page/links-page.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [PrismaModule, LinksPageModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
