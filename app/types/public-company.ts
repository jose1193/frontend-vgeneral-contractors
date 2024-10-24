import { UserData } from "./user";
export interface PublicCompanyData {
  id?: number;
  uuid?: string;
  public_company_name: string;
  address: string | null;
  phone?: string;
  email?: string;
  website?: string;
  unit?: string;
  created_by_user?: UserData;
  created_at?: string | null;
  updated_at?: string | null;
}
