import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from './token.repository';
import { SignOutRequestDto } from './dto/delete-token.dto';
import { TokenInterface } from './dto/token.interface';
import { RefreshTokenRequestDto } from './dto/refresh-token.dto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TokenRepository)
    private tokenRepository: TokenRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<TokenInterface> {
    const user = await this.userRepository.signUp(authCredentialsDto);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const tokenEntity = await this.tokenRepository.createRefreshToken(user);
    return {
      refresh_token: tokenEntity.token,
    };
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenRequestDto,
  ): Promise<TokenInterface> {
    const tokenEntity = await this.tokenRepository.getRefreshToken(
      refreshTokenDto,
    );
    if (!tokenEntity || !tokenEntity.user) {
      this.logger.warn('tokenEntity was empty or without user');
      throw new UnauthorizedException('Invalid Credentials');
    }
    if (tokenEntity.isExpired()) {
      await tokenEntity.remove();
      throw new UnauthorizedException('Invalid Credentials');
    }
    const token = this.jwtService.sign({ email: tokenEntity.user.email });
    return {
      access_token: token,
    };
  }

  async signIn(authDto: AuthCredentialsDto): Promise<TokenInterface> {
    const user = await this.userRepository.validateCredentials(authDto);
    if (!user) {
      this.logger.warn('Invalid Credentials');
      throw new UnauthorizedException('Invalid Credentials');
    }
    const tokenEntity = await this.tokenRepository.createRefreshToken(user);
    return {
      refresh_token: tokenEntity.token,
    };
  }

  async signOut(signOutRequestDto: SignOutRequestDto): Promise<void> {
    this.tokenRepository.deleteToken(signOutRequestDto);
    this.logger.log('Signed out');
  }
}
