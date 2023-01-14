import { Controller, Get, Param, Query } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CatalogService, OrderOptions } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @IsPublic()
  @Get('/:companySlug')
  getCompanyCatalog(@Param('companySlug') companySlug: string) {
    return this.catalogService.getCompanyCatalog(companySlug);
  }

  @IsPublic()
  @Get('/:companySlug/categories')
  getCompanyCatalogCategories(@Param('companySlug') companySlug: string) {
    return this.catalogService.getCompanyCatalogCategories(companySlug);
  }

  @IsPublic()
  @Get('/:companySlug/products')
  getCompanyCatalogProducts(@Param('companySlug') companySlug: string) {
    return this.catalogService.getCompanyCatalogProducts(companySlug);
  }

  @IsPublic()
  @Get('/:companySlug/filtered-products')
  getCompanyCatalogFilteredProducts(
    @Param('companySlug') companySlug: string,
    @Query('page') page: number,
    @Query('categories') categories: string[],
    @Query('order') order: OrderOptions,
    @Query('search') search: string,
  ) {
    return this.catalogService.getCompanyCatalogFilteredProducts(companySlug, {
      page,
      categories,
      order,
      search,
    });
  }

  @IsPublic()
  @Get('/:companySlug/products/:productSlug')
  getCompanyCatalogProduct(
    @Param('companySlug') companySlug: string,
    @Param('productSlug') productSlug: string,
  ) {
    return this.catalogService.getCompanyCatalogProductBySlug(
      companySlug,
      productSlug,
    );
  }

  @IsPublic()
  @Get('/:companySlug/banners')
  getCompanyCatalogBanners(@Param('companySlug') companySlug: string) {
    return this.catalogService.getCompanyCatalogBanners(companySlug);
  }
}
