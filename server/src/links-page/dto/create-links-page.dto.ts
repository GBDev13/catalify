import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class CreateLinksPageDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  headLine?: string;

  @IsString()
  @IsHexColor()
  textColor: string;

  @IsString()
  @IsHexColor()
  textColor2: string;

  @IsString()
  @IsHexColor()
  boxColor: string;

  @IsString()
  boxMode: string;

  @IsString()
  @IsHexColor()
  bgColor: string;

  @IsString()
  @IsHexColor()
  bgColor2: string;

  @IsString()
  bgMode: string;

  @IsString()
  logoMode: string;
}
