import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { UserEntity } from '../user.entity';

export const Roles = (...roles: number[]) => SetMetadata('roles', roles);

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
