import { IsString } from 'class-validator';
import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

export interface AuthRequest extends Request {
  user: User;
}

export class RefreshPayload {
  @IsString()
  refreshToken: string;
}
