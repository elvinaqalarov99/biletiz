export interface Category {
  id: number;
  externalId: number;
  name: string;
  slug: string;
  ordering: number;
  externalUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
