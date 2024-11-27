import { UserData } from "./user";
import { ClaimsData } from "./claims";

export interface ClaimPublicAdjusterData {
  id?: number;
  uuid?: string;
  user_id?: UserData;
  full_pdf_path?: string;
  claim_id?: number;
  public_adjuster_id?: number;
  claim?: ClaimsData;
  adjuster?: UserData;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  generated_by?: string;
}

export type ClaimPublicAdjusterCreateDTO = Omit<
  ClaimPublicAdjusterData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;
export type ClaimPublicAdjusterUpdateDTO =
  Partial<ClaimPublicAdjusterCreateDTO>;

export interface ClaimPublicAdjusterResponse {
  success: boolean;
  data: ClaimPublicAdjusterData;
  message?: string;
}

export interface ClaimPublicAdjusterListResponse {
  success: boolean;
  data: ClaimPublicAdjusterData[];
  message?: string;
}

export interface ClaimPublicAdjusterDeleteResponse {
  success: boolean;
  message?: string;
}

export interface ClaimPublicAdjusterRestoreResponse {
  success: boolean;
  data: ClaimPublicAdjusterData;
  message?: string;
}
