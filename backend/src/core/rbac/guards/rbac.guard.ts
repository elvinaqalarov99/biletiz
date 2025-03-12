import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { RbacService } from "../rbac.service";
import { UserEntity } from "src/common/entities/user.entity";
import { PERMISSIONS_KEY } from "../decorators/permission.decorator";
import { PermissionEnum } from "../enums/permission.enum";

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<
      PermissionEnum[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity; // Assuming the user is attached to the request object (via authentication)

    return this.rbacService.userHasPermissions(user, requiredPermissions);
  }
}
