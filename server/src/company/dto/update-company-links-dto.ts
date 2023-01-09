import { IsString } from 'class-validator';

export class UpdateCompanyLinksDto {
  @IsString({ each: true })
  links: string[];
}
