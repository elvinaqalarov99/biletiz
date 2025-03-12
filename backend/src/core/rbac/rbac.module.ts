import { Module } from "@nestjs/common";
import { RbacService } from "./rbac.service";
import { getBaseTypeOrmFeature } from "src/common/helper";

@Module({
  imports: [getBaseTypeOrmFeature()],
  providers: [RbacService],
  exports: [RbacService],
})
export class RbacModule {}
