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
import { AuthRequest } from './models/AuthRequest';
import { IsPublic } from './decorators/is-public.decorator';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
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
    console.log('chegou no controller');
    return this.userService.onboard(onboardingDto);
  }

  @IsPublic()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req: AuthRequest) {
    return this.authService.login(req.user);
  }
}
