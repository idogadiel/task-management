import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task.status.enum';
import { UserEntity } from '../auth/user.entity';

@Entity()
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    type => UserEntity,
    user => user.tasks,
    { eager: false },
  )
  user: UserEntity;

  @Column()
  userId: string;
}
