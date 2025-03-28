import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';

@Entity('role_permission')
export class RolePermissionEntity {
  @PrimaryColumn()
  roleId: number;

  @PrimaryColumn()
  permissionId: number;

  @ManyToOne(() => RoleEntity, (role) => role.permissions, { cascade: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  grantedAt: Date;
}
