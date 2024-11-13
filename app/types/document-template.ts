// Constants
export const TEMPLATE_TYPES = [
  "Agreement",
  "Agreement Full",
  "Sample",
  "W-9",
  "letter",
  "other",
] as const;
export type TemplateType = (typeof TEMPLATE_TYPES)[number];

export const SUPPORTED_FORMATS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

// Base interface for document template data
export interface DocumentTemplateData {
  id?: number;
  uuid: string | null;
  template_name: string;
  template_description: string | null;
  template_type: TemplateType;
  template_path: File | null;
  uploaded_by?: number;
  created_at?: string;
  updated_at?: string;
}

// Form-specific interface
export type DocumentTemplateFormData = Omit<
  DocumentTemplateData,
  "id" | "uuid" | "uploaded_by"
>;
