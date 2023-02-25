import { User } from '../entities/user.entity';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto extends User {
  @IsString()
  @MaxLength(30)
  firstName: string;

  @IsString()
  @IsOptional()
  @MaxLength(30)
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
