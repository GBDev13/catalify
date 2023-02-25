import { IsHexColor, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLinksPageDto {
  @IsString()
  @MaxLength(40)
  title: string;

  @IsString()
  @MaxLength(100)
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
