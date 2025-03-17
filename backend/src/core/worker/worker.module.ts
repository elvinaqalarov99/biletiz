import { Module } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { getBaseTypeOrmFeature } from "src/common/helper";
import { ITicketApiModule } from "../../integrations/iticket-api/iticket-api.module";
import { CategoryModule } from "src/modules/categories/category.module";

@Module({
  imports: [getBaseTypeOrmFeature(), ITicketApiModule, CategoryModule],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
