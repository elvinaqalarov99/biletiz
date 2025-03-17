import { Category } from "./category";
import { Venue } from "./venue";

export interface Event {
  id: number;
  name: string;
  slug: string;
  ageLimit: number;
  eventStartsAt: Date;
  eventEndsAt: Date;
  sellEndsAt: Date;
  availableTicketsCount: number;
  upcomingMode: boolean | null;
  minPrice: number;
  maxPrice: number;
  posterUrl: string;
  posterBgUrl: string;
  posterWideUrl: string;
  posterWideBgUrl: string;
  publicState: number;
  webViewRotate: boolean;
  search: string;
  externalUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  category: Category;
  venues: Venue[];
}
