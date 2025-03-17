import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventEntity } from "./event.entity";

@Entity("venues")
export class VenueEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  externalId: number;

  @Column()
  name: string;

  @Column()
  mapLat: number;

  @Column()
  mapLng: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  mobile?: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt?: Date;

  @ManyToMany(() => EventEntity, (event) => event.venues)
  events: EventEntity[];
}
