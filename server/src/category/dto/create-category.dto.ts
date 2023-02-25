import { IsString, MaxLength } from 'class-validator';
import { Category } from '../entities/category.entity';

export class CreateCategoryDto extends Category {
  @IsString()
  @MaxLength(30)
  name: string;
}
