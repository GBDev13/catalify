import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTokenDto } from './dto/create-token-dto';

@Injectable()
export class TokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(dto: CreateTokenDto) {
    const jwtToken = await this.jwtService.signAsync(
      {
        sub: dto.userId,
        type: dto.type,
      },
      {
        expiresIn: dto.expiresIn,
      },
    );

    const { exp } = await this.jwtService.verifyAsync(jwtToken);

    const token = await this.prisma.tokens.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        token: jwtToken,
        expiresAt: new Date(exp * 1000),
      },
    });

    return token;
  }

  async findToken(token: string) {
    const tokenRecord = await this.prisma.tokens.findFirst({
      where: {
        token,
      },
    });

    return tokenRecord;
  }

  async deleteToken(token: string) {
    const tokenRecord = await this.prisma.tokens.findFirst({
      where: {
        token,
      },
    });

    if (!tokenRecord) {
      throw new HttpException('Token not found', 404);
    }

    await this.prisma.tokens.delete({
      where: {
        id: tokenRecord.id,
      },
    });

    return tokenRecord;
  }
}
