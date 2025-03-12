import { Module } from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { PermissionController } from "./permission.controller";
import { RbacModule } from "../../core/rbac/rbac.module";
import { getBaseTypeOrmFeature } from "src/common/helper";

@Module({
  imports: [getBaseTypeOrmFeature(), RbacModule], // ✅ Required even with autoLoadEntities: true
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService],
})
export class PermissionModule {}
