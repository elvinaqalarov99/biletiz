import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../roles/role.module';
import { RbacModule } from '../../core/rbac/rbac.module';
import { getBaseTypeOrmFeature } from 'src/common/helper';
import { CategoryEntity } from 'src/common/entities/category.entity';

@Module({
  imports: [getBaseTypeOrmFeature([CategoryEntity]), RoleModule, RbacModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
