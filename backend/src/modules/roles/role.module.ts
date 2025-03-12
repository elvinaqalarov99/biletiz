import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { RbacModule } from "../../core/rbac/rbac.module";
import { PermissionModule } from "../permissions/permission.module";
import { getBaseTypeOrmFeature } from "src/common/helper";

@Module({
  imports: [getBaseTypeOrmFeature(), RbacModule, PermissionModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
