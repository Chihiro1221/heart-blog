import {RoleDocument} from '@db/db/models/role.model';
import {UserDocument} from '@db/db/models/user.model';
import {RoleEnum} from './../enum/role.enum';
import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from '../decorator/role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const user: UserDocument = await req.user.populate('role');
    return requiredRoles.some((role) => {
      return (user.role as RoleDocument).name === role;
    });
  }
}
