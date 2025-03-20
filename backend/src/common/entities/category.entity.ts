import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventEntity } from "./event.entity";
import { UserEntity } from "./user.entity";

@Entity("categories")
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  externalId: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  ordering: number;

  @Column({ nullable: true })
  externalUrl?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date;

  @OneToMany(() => EventEntity, (event) => event.category)
  events: Event[];

  @ManyToMany(() => UserEntity, (user) => user.categoryPreferences)
  preferredBy: UserEntity[];
}
