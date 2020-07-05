import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt/bcrypt.js';
import { TaskEntity } from '../tasks/task.entity';
import { UserEntity } from './user.entity';

@Entity()
export class TokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
