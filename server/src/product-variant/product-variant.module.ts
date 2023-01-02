import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductVariantController } from './product-variant.controller';
import { ProductVariantService } from './product-variant.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [ProductVariantService],
})
export class ProductVariantModule {}
