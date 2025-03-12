import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RoleEnum } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/role.decorator";
import { UserEntity } from "src/common/entities/user.entity";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    if (!user) {
      return false;
    }

    const userRolesSet = new Set(user.roles.map(({ name }) => name));

    return requiredRoles.some((role) => userRolesSet.has(role.toString()));
  }
}
