import { IsString, MinLength } from 'class-validator';

export class RefreshTokenRequestDto {
  @IsString()
  @MinLength(20)
  refreshToken: string;
}
