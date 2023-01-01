import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/:companyId')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('companyId') companyId: string,
  ) {
    return this.categoryService.create(createCategoryDto, companyId);
  }

  @Get('/:companyId')
  async getByCompanyId(@Param('companyId') companyId: string) {
    const categories = await this.categoryService.getByCompanyId(companyId);
    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  }
}
