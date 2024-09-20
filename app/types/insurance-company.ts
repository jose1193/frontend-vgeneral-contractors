export interface InsuranceCompanyData {
  id?: number;
  uuid?: string;
  insurance_company_name: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  created_at?: string | null;
  updated_at?: string | null;
}
