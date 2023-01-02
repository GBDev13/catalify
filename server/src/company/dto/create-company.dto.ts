import { IsHexColor, IsString } from 'class-validator';
import { Company } from '../entities/company.entity';

export class CreateCompanyDto extends Company {
  @IsString()
  name: string;

  @IsString()
  @IsHexColor()
  themeColor: string;
}
