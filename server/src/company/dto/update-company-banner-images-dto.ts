import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

class CompanyBannerDto {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  image: string;

  @IsString()
  @IsOptional()
  link: string;
}

export class UpdateCompanyBannerImagesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CompanyBannerDto)
  banners: CompanyBannerDto[];
}
