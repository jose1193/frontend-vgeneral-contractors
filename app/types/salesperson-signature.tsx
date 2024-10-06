import { UserData } from "./user";

export interface SalesPersonSignatureData {
  id?: number;
  uuid?: string;
  salesperson_id?: number | null;
  signature_path: string;
  salesPerson?: UserData;
  registeredBy?: UserData;
  created_at?: string | null;
  updated_at?: string | null;
}
