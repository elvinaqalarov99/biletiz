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
  UseGuards,
} from "@nestjs/common";
import { RbacGuard } from "../../core/rbac/guards/rbac.guard";
import { Permissions } from "../../core/rbac/decorators/permission.decorator";
import { PermissionEnum } from "../../core/rbac/enums/permission.enum";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { UserCategoryPreferencesService } from "./user-category-preferences.service";
import { UserCategoryPreferenceCreateDto } from "./dto/user-category-preferences-create.dto";

@Controller("user-category-preferences")
@UseGuards(JwtAuthGuard, RbacGuard)
export class UserCategoryPreferenceController {
  constructor(
    private userCategoryPrefService: UserCategoryPreferencesService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Permissions(PermissionEnum.UserCategory_Preference_Read)
  all() {
    return this.userCategoryPrefService.all();
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  @Permissions(PermissionEnum.UserCategory_Preference_Create)
  create(@Body() userCategoryPreferenceDto: UserCategoryPreferenceCreateDto) {
    return this.userCategoryPrefService.create(userCategoryPreferenceDto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(":id")
  @Permissions(PermissionEnum.UserCategory_Preference_Read)
  read(@Param("id", ParseIntPipe) id: number) {
    return this.userCategoryPrefService.findOne({ id });
  }

  @HttpCode(HttpStatus.OK)
  @Delete(":id")
  @Permissions(PermissionEnum.UserCategory_Preference_Delete)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.userCategoryPrefService.delete(id);
  }
}
