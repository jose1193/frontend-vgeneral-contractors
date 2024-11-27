import { UserData } from "./user";
import { ClaimsData } from "./claims";
import { AllianceCompanyData } from "./alliance-company";

export interface ClaimAgreementAllianceData {
  id?: number;
  uuid?: string;
  user_id?: UserData;
  full_pdf_path?: string;
  claim_id?: number;
  alliance_company_id?: number;
  claim?: ClaimsData;
  alliance_company?: AllianceCompanyData;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  generated_by?: string;
}

export type ClaimAgreementAllianceCreateDTO = Omit<
  ClaimAgreementAllianceData,
  "id" | "uuid" | "created_at" | "updated_at" | "deleted_at"
>;
export type ClaimAgreementAllianceUpdateDTO =
  Partial<ClaimAgreementAllianceCreateDTO>;

export interface ClaimAgreementAllianceResponse {
  success: boolean;
  data: ClaimAgreementAllianceData;
  message?: string;
}

export interface ClaimAgreementAllianceListResponse {
  success: boolean;
  data: ClaimAgreementAllianceData[];
  message?: string;
}

export interface ClaimAgreementAllianceDeleteResponse {
  success: boolean;
  message?: string;
}

export interface ClaimAgreementAllianceRestoreResponse {
  success: boolean;
  data: ClaimAgreementAllianceData;
  message?: string;
}
