import { IsHexColor, IsOptional, IsString, Matches } from 'class-validator';
import { Company } from '../entities/company.entity';

export class UpdateCompanyDto extends Company {
  @IsString()
  name: string;

  @IsString()
  @IsHexColor()
  themeColor: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas e números',
  })
  slug: string;

  @IsString()
  @IsOptional()
  logo: string;
}
