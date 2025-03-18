import { Event } from "./event";

export interface Category {
  id: number;
  externalId: number;
  name: string;
  slug: string;
  ordering: number;
  externalUrl: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  events: Event[] | null;
}
