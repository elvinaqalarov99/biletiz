import { Module } from '@nestjs/common';
import { getBaseTypeOrmFeature } from 'src/common/helper';
import { RbacModule } from 'src/core/rbac/rbac.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from 'src/common/entities/category.entity';
import { EventEntity } from 'src/common/entities/event.entity';
import { VenueEntity } from 'src/common/entities/venue.entity';

@Module({
  imports: [
    getBaseTypeOrmFeature([CategoryEntity, EventEntity, VenueEntity]),
    RbacModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
