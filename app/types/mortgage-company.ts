export interface MortgageCompanyData {
  id?: number;
  uuid?: string;
  mortgage_company_name: string;
  address?: string | null;
  phone?: string;
  email?: string;
  website?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}
