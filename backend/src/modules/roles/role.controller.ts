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
import { RoleService } from "./role.service";
import { RoleCreateDto } from "./dto/role-create.dto";
import { RoleUpdateDto } from "./dto/role-update.dto";
import { RbacGuard } from "../../core/rbac/guards/rbac.guard";
import { Permissions } from "../../core/rbac/decorators/permission.decorator";
import { PermissionEnum } from "../../core/rbac/enums/permission.enum";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("roles")
@UseGuards(JwtAuthGuard, RbacGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Permissions(PermissionEnum.Role_Create)
  create(@Body() roleCreateDto: RoleCreateDto) {
    return this.roleService.createRole(roleCreateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @Permissions(PermissionEnum.Role_Read)
  read(@Param("id", ParseIntPipe) id: number) {
    return this.roleService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Put(":id")
  @Permissions(PermissionEnum.Role_Update)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() roleUpdateDto: RoleUpdateDto,
  ) {
    return this.roleService.updateRole(id, roleUpdateDto);
  }

  @Permissions(PermissionEnum.Role_Delete)
  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.roleService.deleteRole(id);
  }
}
