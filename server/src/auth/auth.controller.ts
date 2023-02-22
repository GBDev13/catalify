import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import {
  AuthRequest,
  ForgotPasswordPayload,
  RefreshPayload,
  ResetPasswordPayload,
} from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { OnboardingDto } from './dto/onboarding.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user;
  }

  @IsPublic()
  @Post('onboarding')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() onboardingDto: OnboardingDto) {
    return this.userService.onboard(onboardingDto);
  }

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }

  @IsPublic()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: RefreshPayload) {
    return this.authService.logout(req.refreshToken);
  }

  @IsPublic()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshPayload) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @IsPublic()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() body: ForgotPasswordPayload) {
    return this.authService.forgotPassword(body.email);
  }

  @IsPublic()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() resetPayload: ResetPasswordPayload) {
    return this.authService.resetPassword(
      resetPayload.token,
      resetPayload.password,
    );
  }
}
