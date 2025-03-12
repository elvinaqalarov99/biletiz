import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  ManyToMany,
} from "typeorm";
import { UserRoleEntity } from "./user-role.entity";
import { Exclude } from "class-transformer";
import { PermissionEntity } from "./permission.entity";

@Entity("roles")
export class RoleEntity {
  static readonly SUPER_ADMIN_ROLE: string = "super_admin";
  static readonly ADMIN_ROLE: string = "admin";
  static readonly USER_ROLE: string = "user";

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Exclude()
  @Column({ default: true })
  isActive: boolean;

  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  users: UserRoleEntity[];

  @ManyToMany(() => PermissionEntity, (permission) => permission.roles)
  @JoinTable({
    name: "role_permission", // Pivot table name
    joinColumn: { name: "role_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "permission_id", referencedColumnName: "id" },
  })
  permissions: PermissionEntity[];
}
