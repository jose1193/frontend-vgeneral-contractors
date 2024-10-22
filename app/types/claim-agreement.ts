export interface ClaimAgreementData {
  id?: number;
  uuid?: string;
  claim_id?: number;
  claim_uuid?: string;
  full_pdf_path?: string;
  agreement_type?: string;
  generated_by: string | null;
}
