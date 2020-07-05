import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
@Index(['token'])
export class TokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'varchar' })
  token: string;

  @Column({ type: 'bigint' })
  expiration: number;

  @ManyToOne(
    type => UserEntity,
    user => user.tokens,
    { eager: false },
  )
  user: UserEntity;

  isExpired(): boolean {
    return this.expiration < Date.now();
  }
}
