import { create } from "zustand";
import { InsuranceCompanyData } from "../../app/types/insurance-company";

interface InsuranceCompanyStore {
  insuranceCompanies: InsuranceCompanyData[];
  loading: boolean;
  error: string | null;
  setInsuranceCompanies: (companies: InsuranceCompanyData[]) => void;
  addInsuranceCompany: (company: InsuranceCompanyData) => void;
  updateInsuranceCompany: (uuid: string, company: InsuranceCompanyData) => void;
  deleteInsuranceCompany: (uuid: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInsuranceCompanyStore = create<InsuranceCompanyStore>(
  (set) => ({
    insuranceCompanies: [],
    loading: false,
    error: null,
    setInsuranceCompanies: (companies) =>
      set({ insuranceCompanies: companies }),
    addInsuranceCompany: (company) =>
      set((state) => ({
        insuranceCompanies: [company, ...state.insuranceCompanies].sort(
          (a, b) =>
            a.insurance_company_name.localeCompare(b.insurance_company_name)
        ),
      })),
    updateInsuranceCompany: (uuid, updatedCompany) =>
      set((state) => ({
        insuranceCompanies: state.insuranceCompanies.map((company) =>
          company.uuid === uuid ? updatedCompany : company
        ),
      })),
    deleteInsuranceCompany: (uuid) =>
      set((state) => ({
        insuranceCompanies: state.insuranceCompanies.filter(
          (company) => company.uuid !== uuid
        ),
      })),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
  })
);
