import { TokenType } from '@prisma/client';

export type CreateTokenDto = {
  type: TokenType;
  expiresIn: string;
  userId: string;
};
