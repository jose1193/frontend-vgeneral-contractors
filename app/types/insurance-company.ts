import { AllianceCompanyData } from "./alliance-company";
export interface InsuranceCompanyData {
  id?: number;
  uuid?: string;
  insurance_company_name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  alliance_companies?: AllianceCompanyData[];
  created_at?: string | null;
  updated_at?: string | null;
}
