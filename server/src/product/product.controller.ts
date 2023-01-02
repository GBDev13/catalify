import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
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

  @Put('/:companyId/:productId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.update(updateProductDto, companyId, productId);
  }

  @Get('/:companyId')
  async getByCompanyId(@Param('companyId') companyId: string) {
    const products = await this.productService.getByCompanyId(companyId);
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      createdAt: product.createdAt,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        name: variant.name,
        options: variant.options.map((option) => ({
          id: option.id,
          name: option.name,
        })),
      })),
      category: product?.category
        ? {
            id: product.category.id,
            name: product.category.name,
          }
        : null,
    }));
  }
}
