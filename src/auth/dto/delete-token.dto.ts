import { IsString, MinLength } from 'class-validator';

export class SignOutRequestDto {
  @IsString()
  @MinLength(20)
  refreshToken: string;
}
