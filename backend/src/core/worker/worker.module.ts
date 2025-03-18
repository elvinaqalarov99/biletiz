import { Module } from "@nestjs/common";
import { WorkerService } from "./worker.service";
import { getBaseTypeOrmFeature } from "src/common/helper";
import { ITicketApiModule } from "../../integrations/iticket-api/iticket-api.module";
import { CategoryModule } from "src/modules/categories/category.module";
import { VenueModule } from "src/modules/venues/venue.module";
import { EventModule } from "src/modules/events/event.module";

@Module({
  imports: [
    getBaseTypeOrmFeature(),
    ITicketApiModule,
    CategoryModule,
    VenueModule,
    EventModule,
  ],
  providers: [WorkerService],
  exports: [WorkerService],
})
export class WorkerModule {}
