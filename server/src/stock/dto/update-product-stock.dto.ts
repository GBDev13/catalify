import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, Min, ValidateNested } from 'class-validator';

export class StockQuantityItemDto {
  @IsInt()
  @Min(0)
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
