import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './task.status.enum';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../auth/user.entity';
import { RolesGuard } from '../auth/configurations/role.guard';
import { Role } from '../auth/user.const';
import { GetUser, Roles } from '../auth/configurations/user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private taskService: TasksService) {}

  @Get('/')
  getTasks(
    @Query(ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: UserEntity,
  ) {
    this.logger.verbose(
      'user ' +
        user.email +
        ' retrieving all tasks.' +
        JSON.stringify(filterDto),
    );
    return this.taskService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.taskService.getTaskById(id, user);
  }

  @Post('/')
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: UserEntity,
  ): Promise<TaskEntity> {
    return this.taskService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: string,
    @GetUser() user: UserEntity,
  ): Promise<void> {
    return this.taskService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatusById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: UserEntity,
  ) {
    return this.taskService.updateTaskStatusById(id, status, user);
  }
}
