import { AllianceCompanyData } from "./alliance-company";
// Constants
export const TEMPLATE_TYPES_ALLIANCE = [
  "Agreement",
  "Agreement Full",
  "Sample",
  "letter",
  "other",
] as const;
export type TemplateTypeAlliance = (typeof TEMPLATE_TYPES_ALLIANCE)[number];

export const SUPPORTED_FORMATS_ALLIANCE = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
export const MAX_FILE_SIZE_ALLIANCE = 15 * 1024 * 1024; // 15MB

// Base interface for document template data for alliance
export interface DocumentTemplateAllianceData {
  id?: number;
  uuid: string | null;
  template_name_alliance: string;
  template_description_alliance: string | null;
  template_type_alliance: TemplateTypeAlliance;
  template_path_alliance: File | null;
  uploaded_by?: number;
  alliance_company_id: number;
  alliance_companies?: AllianceCompanyData[];
  alliance_company_name?: string;
  signature_path_id: number | null;
  created_at?: string;
  updated_at?: string;
}

// Form-specific interface for alliance
export type DocumentTemplateAllianceFormData = Omit<
  DocumentTemplateAllianceData,
  "id" | "uuid" | "uploaded_by"
>;
