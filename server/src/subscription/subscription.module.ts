import { Module } from '@nestjs/common';
import { LinksPageModule } from 'src/links-page/links-page.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [PrismaModule, LinksPageModule, StorageModule],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
