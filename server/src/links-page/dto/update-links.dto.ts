import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class LinkDto {
  @IsString()
  @IsOptional()
  originalId: string;

  @IsString()
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
