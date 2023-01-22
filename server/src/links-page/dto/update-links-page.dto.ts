import { IsOptional, IsString } from 'class-validator';
import { CreateLinksPageDto } from './create-links-page.dto';

export class UpdateLinksPageDto extends CreateLinksPageDto {
  @IsString()
  @IsOptional()
  logo: string;
}
