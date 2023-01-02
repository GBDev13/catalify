import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Product } from '../entities/product.entity';

export class UpdateProductDto extends Product {
  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsOptional()
  categoryId: string;
}
