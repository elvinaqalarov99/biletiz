import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { VenueEntity } from './venue.entity';
import { UserEntity } from './user.entity';

@Entity('events')
export class EventEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  externalId: number;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ nullable: true })
  ageLimit: string;

  @Column()
  eventStartsAt: Date;

  @Column()
  eventEndsAt: Date;

  @Column()
  sellEndsAt: Date;

  @Column()
  availableTicketsCount: number;

  @Column({ nullable: true })
  upcomingMode: boolean;

  @Column()
  minPrice: number;

  @Column()
  maxPrice: number;

  @Column({ nullable: true })
  posterUrl: string;

  @Column({ nullable: true })
  posterBgUrl: string;

  @Column({ nullable: true })
  posterWideUrl: string;

  @Column({ nullable: true })
  posterWideBgUrl: string;

  @Column()
  publicState: number;

  @Column()
  webViewRotate: boolean;

  @Column({ nullable: true })
  search: string;

  @Column({ nullable: true })
  externalUrl: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  metaKeywords: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => CategoryEntity, (category) => category.events, {
    cascade: true,
  })
  category: CategoryEntity;

  @ManyToMany(() => VenueEntity, (venue) => venue.events)
  @JoinTable({
    name: 'event_venue', // Pivot table name
    joinColumn: { name: 'event_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'venue_id', referencedColumnName: 'id' },
  })
  venues: VenueEntity[];

  @ManyToMany(() => UserEntity, (user) => user.notifications)
  notifications: UserEntity[];
}
