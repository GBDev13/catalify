import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class OnboardingDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateCompanyDto)
  company: CreateCompanyDto;
}
