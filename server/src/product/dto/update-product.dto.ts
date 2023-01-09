import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
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

  type: 'array' | 'string';

  @ValidateIf((object, value) => object.type === 'array')
  @IsArray()
  @IsString({ each: true })
  imagesToRemove: string[] | string;

  @IsString()
  @IsOptional()
  @MaxLength(800)
  description: string;

  @IsString()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsOptional()
  variations: string;
}

type ChangeType = 'variation' | 'option';
type ActionType = 'remove' | 'change';

export type UpdateProductVariations = {
  edited: {
    id: string;
    type: ChangeType;
    newValue: string;
  }[];
  removed: {
    id: string;
    type: ChangeType;
    actionType: ActionType;
  }[];
  added: {
    type: ChangeType;
    name?: string;
    options?: string[];
    variationId?: string;
    value?: string;
  }[];
};
