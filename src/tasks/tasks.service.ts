import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskRepository} from "./task.repository";
import {InjectRepository} from '@nestjs/typeorm';
import {Task} from "./task.entity";
import {TaskStatus} from "./task.status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter-dto";
import {User} from "../auth/user.entity";

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) {
    }


    getTasks = (getTasksFilterDto: GetTasksFilterDto, user: User): Promise<Task[]> =>
        this.taskRepository.getTasks(getTasksFilterDto, user)


    getTaskById = async (id: number, user: User): Promise<Task> => {
        const task = await this.taskRepository.findOne({where: {id, userId: user.id}})
        if (!task) {
            throw new NotFoundException('Task with id=' + id + ' not found')
        }
        return task
    }

    updateTaskStatusById = async (id: number, status: TaskStatus, user: User): Promise<Task> => {
        const task = await this.getTaskById(id, user)
        task.status = status
        task.save()
        return task
    }

    deleteTaskById = async (id: number, user: User): Promise<void> => {

        const result = await this.taskRepository.delete({id, userId: user.id})
        if (result.affected === 0) {
            throw new NotFoundException('Task with id=' + id + ' not found')
        }
    }

    createTask = async (createTaskDto: CreateTaskDto, user: User): Promise<Task> =>
        this.taskRepository.createTask(createTaskDto, user)
}
