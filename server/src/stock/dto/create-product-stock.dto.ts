import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StockQuantityItemDto {
  @IsPositive()
  @IsInt()
  quantity: number;

  @IsString()
  @IsOptional()
  stockOptionId?: string;
}

export class CreateProductStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockQuantityItemDto)
  stockQuantity: StockQuantityItemDto[];
}
