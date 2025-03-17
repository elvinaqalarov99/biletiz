import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CategoryEntity } from "./category.entity";
import { VenueEntity } from "./venue.entity";

@Entity("events")
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  externalId: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column()
  ageLimit: number;

  @Column()
  eventStartsAt: Date;

  @Column()
  eventEndsAt: Date;

  @Column()
  sellEndsAt: Date;

  @Column()
  availableTicketsCount: number;

  @Column()
  upcomingMode: boolean;

  @Column()
  minPrice: number;

  @Column()
  maxPrice: number;

  @Column()
  posterUrl: string;

  @Column()
  posterBgUrl: string;

  @Column()
  posterWideUrl: string;

  @Column()
  posterWideBgUrl: string;

  @Column()
  publicState: number;

  @Column()
  webViewRotate: boolean;

  @Column()
  search: string;

  @Column()
  externalUrl: string;

  @Column()
  metaTitle: string;

  @Column()
  metaDescription: string;

  @Column()
  metaKeywords: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt: Date;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.events, {
    cascade: true,
  })
  category: CategoryEntity;

  @ManyToMany(() => VenueEntity, (venue) => venue.events)
  @JoinTable({
    name: "event_venue", // Pivot table name
    joinColumn: { name: "event_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "venue_id", referencedColumnName: "id" },
  })
  venues: VenueEntity[];
}
