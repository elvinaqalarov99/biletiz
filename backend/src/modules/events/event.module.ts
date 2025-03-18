import { Module } from "@nestjs/common";
import { getBaseTypeOrmFeature } from "src/common/helper";
import { RbacModule } from "src/core/rbac/rbac.module";
import { CategoryEntity } from "src/common/entities/category.entity";
import { EventEntity } from "src/common/entities/event.entity";
import { VenueEntity } from "src/common/entities/venue.entity";
import { EventController } from "./event.controller";
import { EventService } from "./event.service";

@Module({
  imports: [
    getBaseTypeOrmFeature([CategoryEntity, EventEntity, VenueEntity]),
    RbacModule,
  ],
  controllers: [EventController],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
