import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessTokenRequestDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenRepository } from './token.repository';
import { AuthCredentialsDto } from './dto/access-token.dto';
import { TokenInterface } from './dto/token.interface';

@Injectable()
export class AuthService {
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
      refresh_token: tokenEntity.id,
    };
  }

  async getAccessToken(
    accessTokenRequestDto: AccessTokenRequestDto,
  ): Promise<TokenInterface> {

    const tokenEntity = await this.tokenRepository.getRefreshToken(
      accessTokenRequestDto,
    );
    if (!tokenEntity || !tokenEntity.user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    if (tokenEntity.isExpired()) {
      await tokenEntity.remove();
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = this.jwtService.sign({ username: tokenEntity.user.username });
    return {
      access_token: token,
    };
  }

  async signIn(authDto: AuthCredentialsDto): Promise<TokenInterface> {
    const user = await this.userRepository.validateCredentials(authDto);
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const tokenEntity = await this.tokenRepository.createRefreshToken(user);
    return {
      refresh_token: tokenEntity.id,
    };
  }
}
