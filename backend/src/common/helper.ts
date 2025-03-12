import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { RoleEntity } from "./entities/role.entity";
import { PermissionEntity } from "./entities/permission.entity";
import { UserRoleEntity } from "./entities/user-role.entity";
import { RolePermissionEntity } from "./entities/role-permission.entity";
import { DynamicModule } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

export const getBaseTypeOrmFeature: (
  appendEntities?: EntityClassOrSchema[],
) => DynamicModule = (appendEntities: []) => {
  let entities = [
    UserEntity,
    RoleEntity,
    PermissionEntity,
    UserRoleEntity,
    RolePermissionEntity,
  ];
  entities = [...entities, ...(appendEntities ?? [])];

  return TypeOrmModule.forFeature(entities);
};
