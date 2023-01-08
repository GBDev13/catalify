import { Transform } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { Product } from '../entities/product.entity';
export class VariationDto {
  @IsString()
  name: string;
  @IsArray()
  options: string[];
}
export class CreateProductDto extends Product {
  @IsString()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  price: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  promoPrice: number;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  variations: string;
}
