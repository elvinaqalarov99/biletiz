import { Injectable } from "@nestjs/common";
import { UserEntity } from "src/common/entities/user.entity";

@Injectable()
export class RbacService {
  constructor() {}

  userHasPermissions(user: UserEntity, requiredPermissions: string[]): boolean {
    // Flatten the list of permissions from the user's roles
    const userPermissions = user.roles.flatMap((role) =>
      role?.permissions.map((permission) => permission.name),
    );

    // Check if the user has all the required permissions
    return requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );
  }
}
