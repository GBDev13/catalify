import { Controller, Get, Param } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get()
  getStock() {
    return this.stockService.getStocksGroupedByProduct();
  }

  @Get('/:companyId/stock-options')
  getStockOptions(@Param('companyId') companyId: string) {
    return this.stockService.getStockOptions(companyId);
  }
}
