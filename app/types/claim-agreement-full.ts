import { UserData } from "./user";
import { ClaimsData } from "./claims";
export interface ClaimAgreementFullData {
  id?: number;
  uuid?: string;
  user_id?: UserData;
  full_pdf_path?: string;
  claim_id?: number;
  claim?: ClaimsData;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  user?: string;
}

export type ClaimAgreementFullCreateDTO = Omit<
  ClaimAgreementFullData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;
export type ClaimAgreementFullUpdateDTO = Partial<ClaimAgreementFullCreateDTO>;

export interface ClaimAgreementFullResponse {
  success: boolean;
  data: ClaimAgreementFullData;
  message?: string;
}

export interface ClaimAgreementFullListResponse {
  success: boolean;
  data: ClaimAgreementFullData[];
  message?: string;
}

export interface ClaimAgreementFullDeleteResponse {
  success: boolean;
  message?: string;
}

export interface ClaimAgreementFullRestoreResponse {
  success: boolean;
  data: ClaimAgreementFullData;
  message?: string;
}
