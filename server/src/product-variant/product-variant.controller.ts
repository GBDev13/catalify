import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantService } from './product-variant.service';

@Controller('/product-variant')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantService.create(createProductVariantDto);
  }
}
