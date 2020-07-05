import { EntityRepository, Repository } from 'typeorm';
import { TokenEntity } from './token.entity';
import { UserEntity } from './user.entity';
import { v4 as uuid } from 'uuid';
import { SignOutRequestDto } from './dto/delete-token.dto';
import { RefreshTokenRequestDto } from './dto/refresh-token.dto';

@EntityRepository(TokenEntity)
export class TokenRepository extends Repository<TokenEntity> {
  async getRefreshToken(
    accessTokenRequestDto: RefreshTokenRequestDto,
  ): Promise<TokenEntity> {
    const { refreshToken } = accessTokenRequestDto;
    const tokenEntity = await this.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });
    if (tokenEntity) {
      return tokenEntity;
    }
    return null;
  }

  async deleteToken(signOutRequestDto: SignOutRequestDto) {
    const tokenEntity = await this.findOne({
      where: { token: signOutRequestDto.refreshToken },
      relations: ['user'],
    });

    if (!tokenEntity) {
      return null;
    }

    return tokenEntity.remove();
  }

  async createRefreshToken(user: UserEntity): Promise<TokenEntity> {
    const token = Buffer.from(uuid() + uuid()).toString('base64');
    const tokenEntity: TokenEntity = this.create();
    tokenEntity.user = user;
    tokenEntity.expiration = this.getTimeInMillis(); // 1 day
    tokenEntity.token = token;
    return await tokenEntity.save();
  }

  getTimeInMillis() {
    // return a week from now in millis
    const date = new Date();
    return date.setDate(date.getDate() + 7);
  }
}
