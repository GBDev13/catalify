import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Order } from '../entities/order.entity';

class OrderProductDto {
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
  buyerName: string;

  @IsString()
  buyerPhone: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderProductDto)
  products: OrderProductDto[];
}
