import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RbacGuard } from '../../core/rbac/guards/rbac.guard';
import { Permissions } from '../../core/rbac/decorators/permission.decorator';
import { PermissionEnum } from '../../core/rbac/enums/permission.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CategoryService } from './category.service';

@Controller('categories')
@UseGuards(JwtAuthGuard, RbacGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Permissions(PermissionEnum.Category_Read)
  all() {
    return this.categoryService.all();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Permissions(PermissionEnum.Category_Read)
  read(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne({ id });
  }
}
