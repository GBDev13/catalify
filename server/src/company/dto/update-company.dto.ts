import {
  IsHexColor,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { Company } from '../entities/company.entity';

export class UpdateCompanyDto extends Company {
  @IsString()
  @MaxLength(30)
  name: string;

  @IsString()
  @IsHexColor()
  themeColor: string;

  @IsString()
  phone: string;

  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug deve conter apenas letras minúsculas e números',
  })
  slug: string;

  @IsString()
  @IsOptional()
  logo: string;
}
