import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category-dto';

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

  @Put('/:companyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Body() updateDto: UpdateCategoryDto,
    @Param('companyId') companyId: string,
  ) {
    return this.categoryService.update(updateDto, companyId);
  }

  @Delete('/:companyId/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string, @Param('companyId') companyId: string) {
    return this.categoryService.delete(id, companyId);
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
