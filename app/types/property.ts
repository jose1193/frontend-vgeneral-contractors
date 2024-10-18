import { CustomerData } from "./customer";
export interface PropertyData {
  id?: number;
  uuid?: string;
  property_complete_address?: string;
  property_address: string;
  property_address_2?: string | null | undefined;
  property_state?: string | null | undefined;
  property_city?: string | null | undefined;
  property_postal_code?: string | null | undefined;
  property_country?: string | null | undefined;
  property_latitude?: number | null | undefined;
  property_longitude?: number | null | undefined;
  customer_id?: number;
  customers?: CustomerData[];
  customer_array_id: number[];
  created_at?: string | null | undefined; // Permitir undefined
  updated_at?: string | null | undefined; // Permitir undefined
  associated_customer_ids?: number[];
}
