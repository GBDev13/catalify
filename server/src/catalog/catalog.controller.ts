import { Controller, Get, Param } from '@nestjs/common';
import { IsPublic } from 'src/auth/decorators/is-public.decorator';
import { CatalogService } from './catalog.service';

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
}
