import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt/bcrypt.js';
import { TaskEntity } from '../tasks/task.entity';
import { TokenEntity } from './token.entity';

@Entity()
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  role: number;

  @OneToMany(
    type => TaskEntity,
    task => task.user,
    { eager: true },
  )
  tasks: TaskEntity[];

  @OneToMany(
    type => TokenEntity,
    token => token.user,
    { eager: true },
  )
  tokens: TokenEntity[];

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await bcrypt.hash(password, this.salt);
    return this.password === hashedPassword;
  }
}
