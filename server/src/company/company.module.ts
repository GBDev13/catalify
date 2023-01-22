import { Module } from '@nestjs/common';
import { LinksPageModule } from 'src/links-page/links-page.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';

@Module({
  imports: [PrismaModule, StorageModule, SubscriptionModule, LinksPageModule],
  controllers: [CompanyController],
  providers: [CompanyService],
  exports: [CompanyService],
})
export class CompanyModule {}
