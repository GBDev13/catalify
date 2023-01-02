import { IsString } from 'class-validator';
import { Category } from '../entities/category.entity';

export class UpdateCategoryDto extends Category {
  @IsString()
  id: string;

  @IsString()
  name: string;
}
