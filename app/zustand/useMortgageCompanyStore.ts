// zustand/useMortgageCompanyStore.ts
import { create } from "zustand";
import { MortgageCompanyData } from "../types/mortgage-company";

interface MortgageCompanyStore {
  mortgageCompanies: MortgageCompanyData[];
  loading: boolean;
  error: string | null;
  setMortgageCompanies: (companies: MortgageCompanyData[]) => void;
  addMortgageCompany: (company: MortgageCompanyData) => void;
  updateMortgageCompany: (uuid: string, company: MortgageCompanyData) => void;
  deleteMortgageCompany: (uuid: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMortgageCompanyStore = create<MortgageCompanyStore>((set) => ({
  mortgageCompanies: [],
  loading: false,
  error: null,
  setMortgageCompanies: (companies) => set({ mortgageCompanies: companies }),
  addMortgageCompany: (company) =>
    set((state) => ({
      mortgageCompanies: [company, ...state.mortgageCompanies].sort((a, b) =>
        a.mortgage_company_name.localeCompare(b.mortgage_company_name)
      ),
    })),
  updateMortgageCompany: (uuid, updatedCompany) =>
    set((state) => ({
      mortgageCompanies: state.mortgageCompanies.map((company) =>
        company.uuid === uuid ? updatedCompany : company
      ),
    })),
  deleteMortgageCompany: (uuid) =>
    set((state) => ({
      mortgageCompanies: state.mortgageCompanies.filter(
        (company) => company.uuid !== uuid
      ),
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
