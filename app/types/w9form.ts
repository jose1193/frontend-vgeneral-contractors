export interface W9FormData {
  id?: number;
  uuid?: string;
  name: string;
  business_name?: string;
  is_individual_sole_proprietor?: boolean;
  is_corporation?: boolean;
  is_partnership?: boolean;
  is_limited_liability_company?: boolean;
  is_exempt_payee?: boolean;
  is_other?: boolean;
  llc_tax_classification?: string;
  address: string;
  address_2?: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  latitude?: number;
  longitude?: number;
  requester_name_address?: string;
  account_numbers?: string;
  social_security_number: string;
  employer_identification_number?: string;
  certification_signed?: boolean;
  signature_date?: string;
  status: string;
  notes?: string;
  document_path?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  generated_by?: string;
}

export type W9FormCreateDTO = Omit<
  W9FormData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;

export type W9FormUpdateDTO = Partial<W9FormCreateDTO>;

// Response types para get y list que sí tienen el formato success/data
export interface W9FormListResponse {
  success: boolean;
  data: W9FormData[];
  message?: string;
}

export interface W9FormGetResponse {
  success: boolean;
  data: W9FormData;
  message?: string;
}

// Response type para delete que solo tiene success/message
export interface W9FormDeleteResponse {
  success: boolean;
  message?: string;
}

// Create, update y restore devuelven directamente el objeto W9FormData
export type W9FormCreateResponse = W9FormData;
export type W9FormUpdateResponse = W9FormData;
export type W9FormRestoreResponse = W9FormData;
