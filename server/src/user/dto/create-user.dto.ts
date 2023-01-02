import { User } from '../entities/user.entity';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto extends User {
  @IsString()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
