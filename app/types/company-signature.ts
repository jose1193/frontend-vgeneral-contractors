export interface CompanySignatureData {
  id?: number;
  uuid?: string;
  company_name: string;
  phone: string;
  email: string;
  address: string;
  website?: string | null;
  signature_path: string;
  created_at?: string | null;
  updated_at?: string | null;
}
