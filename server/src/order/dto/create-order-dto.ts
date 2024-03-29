import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Order } from '../entities/order.entity';

class OrderProductDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  productId: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  promoPrice: number;

  @IsInt()
  @IsPositive()
  quantity: number;

  @IsString({ each: true })
  @IsOptional()
  selectedVariants: string[];
}

export class CreateOrderDto extends Order {
  @IsString()
  @MaxLength(100)
  buyerName: string;

  @IsString()
  buyerPhone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}
