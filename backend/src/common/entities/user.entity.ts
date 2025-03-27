import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { Exclude } from 'class-transformer';
import { CategoryEntity } from './category.entity';
import { EventEntity } from './event.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  dateOfBirth?: Date;

  @Column({ nullable: true })
  address?: string;

  @Exclude()
  @Column({ default: false })
  emailVerified?: boolean;

  @Exclude()
  @Column({ default: false })
  twoFactorEnabled?: boolean;

  @Exclude()
  @Column({ nullable: true })
  lastLoginAt?: Date;

  @Exclude()
  @Column({ default: true })
  isActive?: boolean;

  @Exclude()
  @CreateDateColumn()
  createdAt?: Date;

  @Exclude()
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToMany(() => RoleEntity, (role) => role.users)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: RoleEntity[];

  @ManyToMany(() => CategoryEntity, (category) => category.preferredBy)
  @JoinTable({
    name: 'user_category_preferences',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categoryPreferences: CategoryEntity[];

  @ManyToMany(() => EventEntity, (event) => event.notifications)
  @JoinTable({
    name: 'notifications',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'event_id', referencedColumnName: 'id' },
  })
  notifications: EventEntity[];

  @Exclude()
  @DeleteDateColumn()
  deletedAt?: Date;
}
