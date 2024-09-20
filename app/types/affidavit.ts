export interface Affidavit {
  id?: number;
  uuid?: string | null;
  mortgage_company_name?: string | null;
  mortgage_company_phone?: string | null;
  mortgage_loan_number?: string | null;
  amount_paid?: number | null;
  description?: string | null;
  never_had_prior_loss?: boolean;
  has_never_had_prior_loss?: boolean;
}
