export interface PropertyData {
  id?: number;
  uuid?: string;
  property_address: string;
  property_state: string;
  property_city: string;
  property_postal_code: string;
  property_country: string;
  customer_id: number[];
  created_at?: string | null;
  updated_at?: string | null;
}
