import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt/lib/index.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from '../user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'mySecret',
    });
  }

  async validate(payload: JwtPayload): Promise<UserEntity> {
    const { email } = payload;
    const user = await this.userRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
