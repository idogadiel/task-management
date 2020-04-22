import {BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique} from "typeorm";
import * as bcrypt from 'bcrypt/bcrypt.js';
import {Task} from "../tasks/task.entity";


@Entity()
@Unique(['username'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    username: string

    @Column()
    password: string

    @Column()
    salt: string

    @OneToMany(type => Task, task => task.user, {eager: true})
    tasks: Task[]

    async validatePassword(password: string) {
        const maybePassword = await bcrypt.hash(password, this.salt)
        return this.password === maybePassword
    }

}