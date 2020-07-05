import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/access-token.dto';
import { RefreshTokenRequestDto } from './dto/auth-credentials.dto';

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
}
