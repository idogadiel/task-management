import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignOutRequestDto } from './dto/delete-token.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('/signin')
  async signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('/refreshToken')
  async getAccessToken(
    @Body(ValidationPipe) refreshTokenDto: RefreshTokenRequestDto,
  ) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('/signout')
  async signOut(@Body(ValidationPipe) signOutRequestDto: SignOutRequestDto) {
    return this.authService.signOut(signOutRequestDto);
  }
}
