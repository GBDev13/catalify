import { ArrayMinSize, IsArray, IsString } from 'class-validator';
import { ProductVariant } from '../entities/product-variant.entity';

export class CreateProductVariantDto extends ProductVariant {
  @IsString()
  name: string;

  @IsString()
  companyId: string;

  @IsString()
  productId: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  options: string[];
}
