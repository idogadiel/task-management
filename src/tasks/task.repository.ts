import {Task} from "./task.entity";
import {EntityRepository, Repository} from "typeorm";
import {CreateTaskDto} from "./dto/create-task.dto";
import {TaskStatus} from "./task.status.enum";
import {GetTasksFilterDto} from "./dto/get-tasks-filter-dto";
import {User} from "../auth/user.entity";
import {InternalServerErrorException, Logger} from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    private logger = new Logger('TaskRepository')

    createTask = async (createTaskDto: CreateTaskDto, user: User): Promise<Task> => {

        const {title, description} = createTaskDto;

        const task: Task = new Task()
        task.title = title
        task.description = description
        task.status = TaskStatus.OPEN
        task.user = user

        await task.save()
        delete task.user
        return task;
    }

    getTasks = async (filterDto: GetTasksFilterDto, user: User): Promise<Task[]> => {

        const {status, search} = filterDto

        const queryBuilder = this.createQueryBuilder('task')

        queryBuilder.where('task.userId = :userId', {userId: user.id})

        if (status) {
            queryBuilder.andWhere('task.status = :status', {status: status})
        }

        if (search) {
            queryBuilder.andWhere('task.description LIKE :search OR task.title LIKE :search', {search: '%' + search + '%'})
        }

        try {
            const tasks = await queryBuilder.getMany()
            return tasks
        } catch (error) {
            this.logger.error('Failed to get tasks for user: ' + user.username + '.  ')
            throw new InternalServerErrorException()
        }

    };
}