import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserEntity } from '../user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: number[] = this.reflector.get<number[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    return this.matchRoles(roles, user.role);
  }

  private matchRoles(roles: number[], userRole: number): boolean {
    return roles.includes(userRole);
  }
}
