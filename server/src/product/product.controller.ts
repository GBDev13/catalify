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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Validator } from 'class-validator';
import { CurrentSubscriptionIsValid } from 'src/subscription/decorators/current-subscription.decorator';
import { SubscriptionGuard } from 'src/subscription/guards/subscription.guard';
import { CreateProductDto, VariationDto } from './dto/create-product.dto';
import { ImportProductsDto } from './dto/import-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/:companyId')
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('companyId') companyId: string,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
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
                error: 'Variações inválidas',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      }

      return this.productService.create(
        { ...createProductDto, images },
        companyId,
        validSubscription,
      );
    } catch (error) {
      console.log('error during product creation (CONTROLLER)', error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Produto inválido',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/:companyId/import')
  @UseGuards(SubscriptionGuard)
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.CREATED)
  async import(
    @Body() importProductsDto: ImportProductsDto,
    @Param('companyId') companyId: string,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
  ) {
    return this.productService.importProducts(
      importProductsDto,
      companyId,
      validSubscription,
    );
  }

  @Put('/:companyId/:productId')
  @UseInterceptors(FilesInterceptor('images'))
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Express.Multer.File[],
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
  ) {
    return this.productService.update(
      { ...updateProductDto, images },
      companyId,
      productId,
      validSubscription,
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
      categories:
        product?.categories?.length > 0
          ? product?.categories?.map((category) => ({
              id: category.id,
              name: category.name,
            }))
          : null,
      isVisible: product.isVisible,
      isEditable: product.isEditable,
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
      isEditable: product.isEditable,
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
      categories:
        product?.categories?.length > 0
          ? product?.categories?.map((category) => ({
              id: category.id,
              name: category.name,
            }))
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
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleHighlight(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
  ) {
    return this.productService.toggleHighlight(
      companyId,
      productId,
      validSubscription,
    );
  }

  @Patch('/:companyId/:productId/visible')
  @HttpCode(HttpStatus.NO_CONTENT)
  async toggleIsVisible(
    @Param('companyId') companyId: string,
    @Param('productId') productId: string,
  ) {
    return this.productService.toggleIsVisible(companyId, productId);
  }

  @Get('/:companyId/productsVariantsToCopy')
  @HttpCode(HttpStatus.OK)
  async getProductsVariantsToCopy(@Param('companyId') companyId: string) {
    return this.productService.getProductsVariantsToCopy(companyId);
  }
}
