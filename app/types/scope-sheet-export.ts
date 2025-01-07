export interface ScopeSheetExportData {
  id?: number;
  uuid?: string;
  scope_sheet_uuid?: string;
  scope_sheet_id?: number;
  full_pdf_path?: string;
  generated_by?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export type ScopeSheetExportCreateDTO = Omit<
  ScopeSheetExportData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;

export type ScopeSheetExportUpdateDTO = Partial<ScopeSheetExportCreateDTO>;

// Response types for get and list with success/data format
export interface ScopeSheetExportListResponse {
  success: boolean;
  data: ScopeSheetExportData[];
  message?: string;
}

export interface ScopeSheetExportGetResponse {
  success: boolean;
  data: ScopeSheetExportData;
  message?: string;
}

// Response type for delete with only success/message
export interface ScopeSheetExportDeleteResponse {
  success: boolean;
  message?: string;
}

// Create, update and restore return the object directly
export type ScopeSheetExportCreateResponse = ScopeSheetExportData;
export type ScopeSheetExportUpdateResponse = ScopeSheetExportData;
export type ScopeSheetExportRestoreResponse = ScopeSheetExportData;
