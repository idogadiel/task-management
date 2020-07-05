import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as generateUUID } from 'uuid';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<UserEntity> {
    const { email, password } = authCredentialsDto;

    const user = this.create();
    user.id = generateUUID();
    user.role = 1;
    user.email = email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);
    try {
      return await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('email already exist');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateCredentials(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<UserEntity> {
    const { email, password } = authCredentialsDto;
    const user = await this.findOne({ email: email });

    if (user) {
      const isValidatedPassword = await user.validatePassword(password);
      if (isValidatedPassword) {
        return user;
      }
    }
    return null;
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
