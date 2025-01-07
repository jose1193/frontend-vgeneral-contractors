import { UserData } from "./user";
import { ClaimsData } from "./claims";
import { ScopeSheetPresentationData } from "./scope-sheet-presentation";
import { ScopeSheetExportData } from "./scope-sheet-export";

// Base data interface
export interface ScopeSheetData {
  id?: number;
  uuid?: string;
  claim_id?: number;
  claim?: ClaimsData;
  scope_sheet_description?: string;
  generated_by?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  presentations_images?: ScopeSheetPresentationData[];
  zones?: any[];
  scope_sheet_export?: ScopeSheetExportData;
}

// DTO types
export type ScopeSheetCreateDTO = Omit<
  ScopeSheetData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;

export type ScopeSheetUpdateDTO = Partial<ScopeSheetCreateDTO>;

// Response types with success/data format
export interface ScopeSheetListResponse {
  success: boolean;
  data: ScopeSheetData[];
  message?: string;
}

export interface ScopeSheetDeleteResponse {
  success: boolean;
  message?: string;
}

// Direct response types
export type ScopeSheetCreateResponse = ScopeSheetData;
export type ScopeSheetUpdateResponse = ScopeSheetData;
export type ScopeSheetRestoreResponse = ScopeSheetData;
export type ScopeSheetGetResponse = ScopeSheetData;
