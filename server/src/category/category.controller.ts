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
  UseGuards,
} from '@nestjs/common';
import { CurrentSubscriptionIsValid } from 'src/subscription/decorators/current-subscription.decorator';
import { SubscriptionGuard } from 'src/subscription/guards/subscription.guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category-dto';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/:companyId')
  @UseGuards(SubscriptionGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('companyId') companyId: string,
    @CurrentSubscriptionIsValid() validSubscription: boolean,
  ) {
    return this.categoryService.create(
      createCategoryDto,
      companyId,
      validSubscription,
    );
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
