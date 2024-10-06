import { UserData } from "./user";
export interface CustomerSignatureData {
  id?: number;
  uuid?: string;
  signature_data: string;
  customer_id: number;
  user_id_ref_by: number;
  created_at?: string;
  updated_at?: string;
  created_by_user?: UserData;
}
