import { Category } from "./category";
import { Venue } from "./venue";

export interface Event {
  id: number;
  name: string;
  slug: string;
  ageLimit: number;
  eventStartsAt: string;
  eventEndsAt: string;
  sellEndsAt: string;
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
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  category: Category;
  venues: Venue[];
}
