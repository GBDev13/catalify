import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/:companyId')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createProductDto: CreateProductDto,
    @Param('companyId') companyId: string,
  ) {
    return this.productService.create(createProductDto, companyId);
  }
}
