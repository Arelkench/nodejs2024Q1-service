import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(
    @Body(new ValidationPipe({ whitelist: true })) userDto: CreateUserDto,
  ) {
    return;
  }

  @Post('login')
  login(@Body(new ValidationPipe({ whitelist: true })) userDto: CreateUserDto) {
    return;
  }

  @Post('refresh')
  refresh() {
    return;
  }
}
