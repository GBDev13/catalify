import { IsEmail, IsString } from 'class-validator';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

export interface AuthRequest extends Request {
  user: User;
}

export class RefreshPayload {
  @IsString()
  refreshToken: string;
}
export class ForgotPasswordPayload {
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPasswordPayload {
  @IsString()
  password: string;

  @IsString()
  token: string;
}
