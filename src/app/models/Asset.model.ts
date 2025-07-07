export interface Asset {
  id: number;
  name: string;
  code: string;
  description: string;
  purchaseDate: string; // ISO date string yyyy-mm-dd
  value: number;
  categoryId: number;
  locationId: number;
}
