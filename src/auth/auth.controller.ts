import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body(new ValidationPipe({ whitelist: true })) userDto: SignUpDto) {
    return this.authService.signup(userDto);
  }

  @Post('login')
  login(@Body(new ValidationPipe({ whitelist: true })) userDto: LoginDto) {
    return this.authService.login(userDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @Body(
      new ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNAUTHORIZED,
      }),
    )
    createRefreshTokenDto: CreateRefreshTokenDto,
  ) {
    return this.authService.refresh(createRefreshTokenDto);
  }
}
