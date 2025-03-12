import { Module } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { getBaseTypeOrmFeature } from "src/common/helper";
import { ITicketApiModule } from "../../integrations/iticket-api/iticket-api.module";

@Module({
  imports: [getBaseTypeOrmFeature(), ITicketApiModule],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
