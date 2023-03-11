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
  @MaxLength(100)
  name: string;
  @IsArray()
  options: string[];
}
export class CreateProductDto extends Product {
  @IsString()
  @MaxLength(100)
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
  @MaxLength(800)
  description: string;

  @IsString({ each: true })
  @IsOptional()
  categoriesIds: string[];

  @IsString()
  @IsOptional()
  variations: string;
}
