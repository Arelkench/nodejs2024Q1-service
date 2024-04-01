import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRefreshTokenDto {
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
