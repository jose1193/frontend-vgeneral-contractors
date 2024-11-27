import { UserData } from "./user";
import { ClaimsData } from "./claims";
export interface ClaimAgreementData {
  id?: number;
  uuid?: string;
  full_pdf_path?: string;
  claim_id?: number;
  claim?: ClaimsData;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  agreement_type?: string;
  generated_by?: string;
}

export type ClaimAgreementCreateDTO = Omit<
  ClaimAgreementData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;
export type ClaimAgreementUpdateDTO = Partial<ClaimAgreementCreateDTO>;

export interface ClaimAgreementResponse {
  success: boolean;
  data: ClaimAgreementData;
  message?: string;
}

export interface ClaimAgreementListResponse {
  success: boolean;
  data: ClaimAgreementData[];
  message?: string;
}

export interface ClaimAgreementDeleteResponse {
  success: boolean;
  message?: string;
}

export interface ClaimAgreementRestoreResponse {
  success: boolean;
  data: ClaimAgreementData;
  message?: string;
}
