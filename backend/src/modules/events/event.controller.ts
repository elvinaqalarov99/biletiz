import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { RbacGuard } from "../../core/rbac/guards/rbac.guard";
import { Permissions } from "../../core/rbac/decorators/permission.decorator";
import { PermissionEnum } from "../../core/rbac/enums/permission.enum";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { EventService } from "./event.service";

@Controller("events")
@UseGuards(JwtAuthGuard, RbacGuard)
export class EventController {
  constructor(private eventService: EventService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Permissions(PermissionEnum.Event_Read)
  all() {
    return this.eventService.all();
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @Permissions(PermissionEnum.Event_Read)
  read(@Param("id", ParseIntPipe) id: number) {
    return this.eventService.findOne({ id });
  }
}
