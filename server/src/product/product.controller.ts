import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Validator } from 'class-validator';
import { CreateProductDto, VariationDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/:companyId')
  @UseInterceptors(FilesInterceptor('images'))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('companyId') companyId: string,
  ) {
    try {
      if (createProductDto?.variations) {
        const parsedVariations = JSON.parse(createProductDto.variations);

        const variations: VariationDto[] = [];

        const validator = new Validator();

        for (const variation of parsedVariations) {
          const newOne = new VariationDto();
          newOne.name = variation.name;
          newOne.options = variation.options;
          const variationsIsValid = await validator.validate(variations);

          if (variationsIsValid.length > 0) {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                error: 'Variations are not valid',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      return this.productService.create(
        { ...createProductDto, images },
        companyId,
      );
    } catch (error) {
      console.log('error during product creation (CONTROLLER)', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Product is not valid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('/:companyId/:productId')
  @UseInterceptors(FilesInterceptor('images'))
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.update(
      { ...updateProductDto, images },
      companyId,
      productId,
    );
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
      promoPrice: product?.promoPrice,
      isHighlighted: !!product?.isHighlighted,
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

  @Get('/details/:productId')
  async getProductById(@Param('productId') productId: string) {
    const product = await this.productService.getById(productId);
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      createdAt: product.createdAt,
      promoPrice: product?.promoPrice,
      pictures: product.pictures.map((picture) => ({
        id: picture.id,
        url: picture.fileUrl,
      })),
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
    };
  }

  @Delete('/:companyId/:productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.delete(companyId, productId);
  }

  @Patch('/:companyId/:productId/highlight')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleHighlight(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.toggleHighlight(companyId, productId);
  }
}
