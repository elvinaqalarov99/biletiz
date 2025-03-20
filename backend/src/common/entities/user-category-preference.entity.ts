import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";
import { CategoryEntity } from "./category.entity";

@Entity("user_category_preferences")
export class UserCategoryPreferenceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  categoryId: number;

  @ManyToOne(() => UserEntity, (user) => user.categoryPreferences, {
    cascade: true,
  })
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.userPreferences, {
    cascade: true,
  })
  @JoinColumn({ name: "category_id" })
  category: CategoryEntity;

  @Column()
  assignedAt: Date;
}
