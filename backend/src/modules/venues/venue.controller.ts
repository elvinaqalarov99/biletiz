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
import { VenueService } from './venue.service';

@Controller('venues')
@UseGuards(JwtAuthGuard, RbacGuard)
export class VenueController {
  constructor(private venueService: VenueService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @Permissions(PermissionEnum.Venue_Read)
  all() {
    return this.venueService.all();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Permissions(PermissionEnum.Venue_Read)
  read(@Param('id', ParseIntPipe) id: number) {
    return this.venueService.findOne({ id });
  }
}
