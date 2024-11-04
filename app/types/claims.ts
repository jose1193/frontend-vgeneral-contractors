import { Affidavit } from "./affidavit";
import { CustomerData } from "./customer";
import { PropertyData } from "./property";
import { AllianceCompanyData } from "./alliance-company";
import { ServiceRequestData } from "./service-request";
import { ClaimStatusData } from "./claim-status";
import { CauseOfLossData } from "./cause-of-loss";
import { UserData } from "./user";
import { ClaimAgreementData } from "./claim-agreement";
import { MortgageCompanyData } from "./mortgage-company";

export interface TechnicalAssignment {
  id: number;
  technical_user_name: string;
}

export interface ClaimsData {
  id?: number;
  uuid?: string;
  customer_id?: number;
  property_id?: number;
  type_damage_id: number;
  type_damage?: string;
  damage_description: string | null;
  user_ref_by?: string;
  policy_number: string;
  user_id_ref_by?: number;
  claim_number?: string;
  claim_internal_id?: string;
  claim_status?: ClaimStatusData;
  date_of_loss: string | null;
  description_of_loss: string | null;
  number_of_floors?: number | null;
  insurance_company_id?: number;

  insurance_company_assignment: string | null;
  public_company_id: number | null;
  public_adjuster_id: number | null;
  public_adjuster_assignment: UserData;
  public_company_assignment: string | null;
  technical_user_id: number[] | null;
  technical_assignments: TechnicalAssignment[];
  cause_of_loss_id: CauseOfLossData[];
  work_date: string | null;
  service_request_id: number[] | null;
  scope_of_work: string | null;
  alliance_company_id?: number | null;
  alliance_companies: AllianceCompanyData;

  mortgage_companies: MortgageCompanyData;

  requested_services: ServiceRequestData[];

  affidavit: {
    mortgage_company_id?: number | null;
    mortgage_loan_number: string | null;
    amount_paid: number | null;
    description: string | null;
    never_had_prior_loss: boolean | null;
    has_never_had_prior_loss: boolean | null;
  };

  customers: CustomerData[] | null;
  property: PropertyData;
  claim_agreements: ClaimAgreementData[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
