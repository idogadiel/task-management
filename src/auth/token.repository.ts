import { EntityRepository, Repository } from 'typeorm';
import { TokenEntity } from './token.entity';
import { AccessTokenRequestDto } from './dto/auth-credentials.dto';
import { UserEntity } from './user.entity';
import { v4 as generateUUID } from 'uuid';

@EntityRepository(TokenEntity)
export class TokenRepository extends Repository<TokenEntity> {
  async getRefreshToken(
    accessTokenRequestDto: AccessTokenRequestDto,
  ): Promise<TokenEntity> {
    const { refreshToken } = accessTokenRequestDto;
    const tokenEntity: TokenEntity = await this.findOne({where: { id: refreshToken }, relations: ['user']});
    if (tokenEntity) {
      return tokenEntity;
    }
    return null;
  }

  async createRefreshToken(user: UserEntity): Promise<TokenEntity> {
    const uuid = generateUUID();
    const tokenEntity: TokenEntity = this.create();
    tokenEntity.user = user;
    tokenEntity.expiration = Date.now() + 1000 * 60 * 60 * 24 * 1; // 1 day
    tokenEntity.id = uuid;
    return await tokenEntity.save();
  }
}
