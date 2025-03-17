export interface Venue {
  id: number;
  name: string;
  mapLat: number;
  mapLng: number;
  phone: string | null;
  mobile: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
