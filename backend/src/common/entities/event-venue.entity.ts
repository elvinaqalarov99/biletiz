import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { EventEntity } from "./event.entity";
import { VenueEntity } from "./venue.entity";

@Entity("event_venue")
export class EventVenueEntity {
  @PrimaryColumn()
  eventId: number;

  @PrimaryColumn()
  venueId: number;

  @ManyToOne(() => EventEntity, (event) => event.venues, { cascade: true })
  @JoinColumn({ name: "event_id" })
  role: EventEntity;

  @ManyToOne(() => VenueEntity, (venue) => venue.events, { cascade: true })
  @JoinColumn({ name: "venue_id" })
  permission: VenueEntity;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  assignedAt: Date;
}
