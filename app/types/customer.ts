import { CustomerSignatureData } from "./customer-signature";
import { PropertyData } from "./property";
export interface CustomerData {
  id?: number;
  customer_id?: number;
  uuid?: string;
  name: string;
  last_name: string;
  cell_phone: string;
  home_phone?: string | null;
  email: string;
  occupation?: string | null;
  property?: PropertyData[];
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  role?: string;
  signature_customer?: CustomerSignatureData;
  property_id?: number;
}
