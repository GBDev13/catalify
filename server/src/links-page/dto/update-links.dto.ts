import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class LinkDto {
  @IsString()
  @IsOptional()
  originalId: string;

  @IsString()
  @MaxLength(40)
  title: string;

  @IsString()
  url: string;
}

export class UpdateLinksDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links: LinkDto[];
}
