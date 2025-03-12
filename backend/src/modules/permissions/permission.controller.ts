import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { PermissionCreateDto } from "./dto/permission-create.dto";
import { PermissionUpdateDto } from "./dto/permission-update.dto";
import { RbacGuard } from "../../core/rbac/guards/rbac.guard";
import { Permissions } from "../../core/rbac/decorators/permission.decorator";
import { PermissionEnum } from "../../core/rbac/enums/permission.enum";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("permissions")
@UseGuards(JwtAuthGuard, RbacGuard)
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Permissions(PermissionEnum.Permission_Create)
  create(@Body() roleCreateDto: PermissionCreateDto) {
    return this.permissionService.createPermission(roleCreateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @Permissions(PermissionEnum.Permission_Read)
  read(@Param("id", ParseIntPipe) id: number) {
    return this.permissionService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Put(":id")
  @Permissions(PermissionEnum.Permission_Update)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() roleUpdateDto: PermissionUpdateDto,
  ) {
    return this.permissionService.updatePermission(id, roleUpdateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  @Permissions(PermissionEnum.Permission_Delete)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.permissionService.deletePermission(id);
  }
}
