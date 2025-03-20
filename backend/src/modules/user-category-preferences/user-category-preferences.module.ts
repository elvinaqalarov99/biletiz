import { Module } from "@nestjs/common";
import { UserCategoryPreferencesService } from "./user-category-preferences.service";
import { UserCategoryPreferenceController } from "./user-category-preferences.controller";
import { RbacModule } from "../../core/rbac/rbac.module";
import { getBaseTypeOrmFeature } from "src/common/helper";
import { UserCategoryPreferenceEntity } from "src/common/entities/user-category-preference.entity";

@Module({
  imports: [getBaseTypeOrmFeature([UserCategoryPreferenceEntity]), RbacModule], // ✅ Required even with autoLoadEntities: true
  controllers: [UserCategoryPreferenceController],
  providers: [UserCategoryPreferencesService],
  exports: [UserCategoryPreferencesService],
})
export class UserCategoryPreferencesModule {}
