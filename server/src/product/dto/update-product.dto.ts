import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsPositive()
  price: number;

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
