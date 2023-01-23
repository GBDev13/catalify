import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  imports: [PrismaModule],
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
