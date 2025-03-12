import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { RoleEntity } from "./role.entity";
import { UserEntity } from "./user.entity";

@Entity("user_role")
export class UserRoleEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  roleId: number;

  @ManyToOne(() => UserEntity, (user) => user.roles, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.users, { onDelete: "CASCADE" })
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assignedAt: Date;
}
