// app/types/claimsTypes.ts
import { UserData as AppUserData } from "./user";
import { InsuranceCompanyData } from "./insurance-company";
import { MortgageCompanyData } from "./mortgage-company";
import { PublicCompanyData } from "./public-company";
import { AllianceCompanyData } from "./alliance-company";
import { TypeDamageData } from "./type-damage";
import { CauseOfLossData } from "./cause-of-loss";
import { ServiceRequestData } from "./service-request";

export interface StoreState {
  insuranceCompanies: InsuranceCompanyData[];
  mortgageCompanies: MortgageCompanyData[];
  publicCompanies: PublicCompanyData[];
  allianceCompanies: AllianceCompanyData[];
  typeDamages: TypeDamageData[];
  users: AppUserData[];
  causesOfLoss: CauseOfLossData[];
  services: ServiceRequestData[];
}

export interface EntityGetters {
  getInsuranceCompanyName: () => string;
  getMortgageCompanyName: () => string;
  getPublicCompanyName: () => string;
  getPublicAdjusterName: () => string;
  getServiceNames: () => string;
  getTypeDamage: () => string;
  getCauseOfLossNames: () => string;
  getAllianceCompanyName: () => string;
  getPropertyInfo: () => { address: string; customers: any[] };
}

export interface ClaimsSummaryProps {
  watch: () => any;
}
