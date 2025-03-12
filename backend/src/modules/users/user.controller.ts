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
import { UserService } from "./user.service";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserUpdateDto } from "./dto/user-update.dto";
import { RbacGuard } from "../../core/rbac/guards/rbac.guard";
import { Permissions } from "../../core/rbac/decorators/permission.decorator";
import { PermissionEnum } from "../../core/rbac/enums/permission.enum";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("users")
@UseGuards(JwtAuthGuard, RbacGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @Permissions(PermissionEnum.User_Create)
  create(@Body() userLoginDto: UserLoginDto) {
    return this.userService.createUser(userLoginDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @Permissions(PermissionEnum.User_Read)
  read(@Param("id", ParseIntPipe) id: number) {
    return this.userService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Put(":id")
  @Permissions(PermissionEnum.User_Update)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() userUpdateDto: UserUpdateDto,
  ) {
    return this.userService.updateUser(id, userUpdateDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  @Permissions(PermissionEnum.User_Delete)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
