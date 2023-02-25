import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCompanySiteDetailsDto {
  @IsString()
  @IsOptional()
  favicon?: string;

  @IsBoolean()
  withFloatingButton: boolean;

  @IsString()
  @IsEnum(['cover', 'contain'])
  imageFitMode: 'cover' | 'contain';
}
