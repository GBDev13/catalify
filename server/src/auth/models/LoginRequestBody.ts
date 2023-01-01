import { IsString } from 'class-validator';

export class LoginRequestBody {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
