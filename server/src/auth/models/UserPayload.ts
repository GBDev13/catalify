export interface UserPayload {
  sub: string;
  email: string;
  firstName: string;
  lastName?: string;
  iat?: number;
  exp?: number;
}
