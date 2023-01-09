import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  imports: [PrismaModule, CompanyModule],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
