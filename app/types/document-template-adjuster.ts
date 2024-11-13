// Constants
export const TEMPLATE_TYPES_ADJUSTER = ["Sample", "Form"] as const;

export type TemplateTypeAdjuster = (typeof TEMPLATE_TYPES_ADJUSTER)[number];

export const SUPPORTED_FORMATS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

export const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

// Base interface for document template adjuster data
export interface DocumentTemplateAdjusterData {
  id?: number;
  uuid: string | null;
  template_description_adjuster: string | null;
  template_type_adjuster: TemplateTypeAdjuster;
  template_path_adjuster: File | null;
  template_path_adjuster_url?: string;
  public_adjuster_id: number | null;
  uploaded_by?: string;
  created_at?: string;
  updated_at?: string;
  adjuster?: string;
}

// Form-specific interface for adjuster
export type DocumentTemplateAdjusterFormData = Omit<
  DocumentTemplateAdjusterData,
  "id" | "uuid" | "uploaded_by" | "created_at" | "updated_at" | "adjuster"
>;
