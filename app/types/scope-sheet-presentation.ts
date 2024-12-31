export interface ScopeSheetPresentationData {
  id?: number;
  uuid?: string;
  scope_sheet_id?: number;
  photo_type?: string;
  photo_order?: number;
  photo_path?: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export type ScopeSheetPresentationCreateDTO = Omit<
  ScopeSheetPresentationData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;

export type ScopeSheetPresentationUpdateDTO =
  Partial<ScopeSheetPresentationCreateDTO>;

// Response types for get and list with success/data format
export interface ScopeSheetPresentationListResponse {
  success: boolean;
  data: ScopeSheetPresentationData[];
  message?: string;
}

export interface ScopeSheetPresentationGetResponse {
  success: boolean;
  data: ScopeSheetPresentationData;
  message?: string;
}

// Response type for delete with only success/message
export interface ScopeSheetPresentationDeleteResponse {
  success: boolean;
  message?: string;
}

// Create, update and restore return the object directly
export type ScopeSheetPresentationCreateResponse = ScopeSheetPresentationData;
export type ScopeSheetPresentationUpdateResponse = ScopeSheetPresentationData;
export type ScopeSheetPresentationRestoreResponse = ScopeSheetPresentationData;
