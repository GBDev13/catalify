import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedError } from './errors/unauthorized.error';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { UserToken } from './models/UserToken';
import { TokenService } from 'src/token/token.service';
import { TOKENS_DURATION } from 'src/stripe/constants';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokensService: TokenService,
    private readonly mailService: MailService,
  ) {}

  async getTokens(userId: string, payload: Record<string, unknown>) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: TOKENS_DURATION.ACCESS_TOKEN,
    });

    const refreshToken = await this.tokensService.createToken({
      expiresIn: TOKENS_DURATION.REFRESH_TOKEN,
      userId,
      type: 'REFRESH_TOKEN',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken.token,
    };
  }

  async login(user: User): Promise<UserToken> {
    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user?.lastName,
    };

    const tokens = await this.getTokens(user.id, payload);

    return {
      user,
      ...tokens,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError('Email e/ou senha inválidos.');
  }

  async logout(token: string) {
    await this.tokensService.deleteToken(token);
  }

  async refreshToken(token: string) {
    const refreshToken = await this.tokensService.findToken(token);

    if (refreshToken) {
      const { sub } = await this.jwtService.verifyAsync(refreshToken.token);

      const user = await this.userService.findById(sub);

      if (user) {
        const payload = {
          sub: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user?.lastName,
        };

        const newToken = await this.jwtService.signAsync(payload, {
          expiresIn: TOKENS_DURATION.ACCESS_TOKEN,
        });

        return {
          access_token: newToken,
        };
      }
    }

    throw new UnauthorizedError('Token inválido.');
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError('Email não cadastrado.');
    }

    await this.tokensService.deleteUserTokensByType(user.id, 'PASSWORD_RESET');

    const token = await this.tokensService.createToken({
      expiresIn: TOKENS_DURATION.PASSWORD_RESET,
      userId: user.id,
      type: 'PASSWORD_RESET',
    });

    await this.mailService.sendMail({
      to: [
        {
          email: user.email,
          name: user.firstName,
        },
      ],
      subject: 'Recuperação de senha',
      template: {
        name: 'forgot-password',
        context: {
          name: user.firstName,
          href: `${process.env.FRONT_END_URL}/esqueci-a-senha?token=${token.token}`,
        },
      },
    });
  }

  async resetPassword(token: string, password: string) {
    const passwordResetToken = await this.tokensService.findToken(token);

    if (!passwordResetToken) {
      new UnauthorizedError('Token inválido.');
    }

    const { sub } = await this.jwtService.verifyAsync(passwordResetToken.token);

    const user = await this.userService.findById(sub);

    if (!user) {
      new UnauthorizedError('Usuário não encontrado.');
    }

    await this.userService.updatePassword(user.id, password);
    await this.tokensService.deleteUserTokens(user.id);

    return;
  }
}
