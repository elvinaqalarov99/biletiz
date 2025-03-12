import { Module } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { getBaseTypeOrmFeature } from "src/common/helper";

@Module({
  imports: [getBaseTypeOrmFeature()],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
