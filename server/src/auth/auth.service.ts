import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
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
    if (!user?.emailVerifiedAt) {
      throw new UnauthorizedException(
        'Sua conta ainda não foi verificada. Verifique seu email.',
      );
    }

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

    throw new UnauthorizedException('Email e/ou senha inválidos.');
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

    throw new HttpException('Token de verificação inválido.', 400);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new HttpException('Email não cadastrado.', 404);
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
      throw new HttpException('Token de verificação inválido.', 400);
    }

    const { sub } = await this.jwtService.verifyAsync(passwordResetToken.token);

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new HttpException('Usuário não encontrado.', 404);
    }

    await this.userService.updatePassword(user.id, password);
    await this.tokensService.deleteUserTokens(user.id);

    return;
  }

  async verifyEmail(token: string) {
    const emailVerificationToken = await this.tokensService.findToken(token);

    if (!emailVerificationToken) {
      throw new HttpException('Token de verificação inválido.', 400);
    }

    const { sub } = await this.jwtService.verifyAsync(
      emailVerificationToken.token,
    );

    const user = await this.userService.findById(sub);

    if (!user) {
      throw new HttpException('Usuário não encontrado.', 404);
    }

    await this.userService.updateEmailVerified(user.id, true);
    await this.tokensService.deleteUserTokens(user.id);
    return;
  }

  async resendVerificationEmail(oldToken: string) {
    const emailVerificationToken = await this.tokensService.findToken(oldToken);

    if (!emailVerificationToken) {
      throw new HttpException('Token de verificação inválido.', 400);
    }

    const decoded = this.jwtService.decode(emailVerificationToken.token);

    const user = await this.userService.findById(decoded.sub);

    if (!user) {
      throw new HttpException('Usuário não encontrado.', 404);
    }

    if (user.emailVerifiedAt) {
      throw new HttpException('Email já verificado.', 400);
    }

    await this.tokensService.deleteUserTokensByType(
      user.id,
      'EMAIL_VERIFICATION',
    );
    await this.userService.sendEmailVerification({
      email: user.email,
      firstName: user.firstName,
      userId: user.id,
    });
  }
}
