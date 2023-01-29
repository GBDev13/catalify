import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateProductStockDto } from './dto/create-product-stock.dto';
import { UpdateProductStockDto } from './dto/update-product-stock.dto';
import { StockService } from './stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get('/:companyId')
  getStock(@Param('companyId') companyId: string) {
    return this.stockService.getStocksGroupedByProduct(companyId);
  }

  @Get('/:companyId/stock-options')
  getStockOptions(@Param('companyId') companyId: string) {
    return this.stockService.getStockOptions(companyId);
  }

  @Post('/:companyId/product/:productId')
  createProductStock(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @CurrentUser() user: User,
    @Body() createProductStockDto: CreateProductStockDto,
  ) {
    return this.stockService.createProductStock(
      companyId,
      productId,
      user,
      createProductStockDto,
    );
  }

  @Delete('/:companyId/product/:productId')
  deleteProductStock(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @CurrentUser() user: User,
  ) {
    return this.stockService.deleteProductStock(companyId, productId, user);
  }

  @Get('/:companyId/product/:productId')
  getProductStock(@Param('productId') productId: string) {
    return this.stockService.getProductStock(productId);
  }

  @Put('/:companyId/product/:productId')
  updateProductStock(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @CurrentUser() user: User,
    @Body() updateProductStockDto: UpdateProductStockDto,
  ) {
    return this.stockService.updateProductStock(
      companyId,
      productId,
      user,
      updateProductStockDto,
    );
  }
}
