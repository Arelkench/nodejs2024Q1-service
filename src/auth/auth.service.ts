import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { JwtPayload, decode } from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

interface Payload extends JwtPayload {
  userId: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ login, password }: CreateUserDto) {
    const hashPassword = await bcrypt.hash(password, +process.env.CRYPT_SALT);

    const user = await this.prisma.user.create({
      data: { login, password: hashPassword },
    });

    return user;
  }

  async login({ login, password }: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { login },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new NotFoundException("Password doesn't match");
    }

    const payload = { userId: user.id, login: user.login };
    const tokens = await this.generateTokens(payload);

    return { ...payload, ...tokens };
  }

  async refresh({ refreshToken }: CreateRefreshTokenDto) {
    try {
      await this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
    } catch {
      throw new ForbiddenException('Refresh token is not valid');
    }

    const { userId, login } = decode(refreshToken) as Payload;

    const newTokens = await this.generateTokens({ userId, login });

    return { userId, login, ...newTokens };
  }

  async generateTokens(payload: Payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }
}
