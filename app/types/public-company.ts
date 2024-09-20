export interface PublicCompanyData {
  id?: number;
  uuid?: string;
  public_company_name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  unit?: string;
  created_at?: string | null;
  updated_at?: string | null;
}
