import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class StockQuantityItemDto {
  @IsPositive()
  @IsInt()
  quantity: number;

  @IsString()
  productStockId: string;
}

export class UpdateProductStockDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StockQuantityItemDto)
  stockQuantity: StockQuantityItemDto[];
}
