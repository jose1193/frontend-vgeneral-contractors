export interface AllianceCompanyData {
  id?: number;
  uuid?: string;
  alliance_company_name: string;
  address: string | null;
  phone?: string;
  email?: string;
  website?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}
