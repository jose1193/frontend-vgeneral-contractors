import { create } from "zustand";
import { AllianceCompanyData } from "../../app/types/alliance-company";

interface AllianceCompanyStore {
  allianceCompanies: AllianceCompanyData[];
  loading: boolean;
  error: string | null;
  setAllianceCompanies: (companies: AllianceCompanyData[]) => void;
  addAllianceCompany: (company: AllianceCompanyData) => void;
  updateAllianceCompany: (uuid: string, company: AllianceCompanyData) => void;
  deleteAllianceCompany: (uuid: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAllianceCompanyStore = create<AllianceCompanyStore>((set) => ({
  allianceCompanies: [],
  loading: false,
  error: null,

  setAllianceCompanies: (companies) => set({ allianceCompanies: companies }),

  addAllianceCompany: (company) =>
    set((state) => ({
      allianceCompanies: [company, ...state.allianceCompanies].sort((a, b) =>
        a.alliance_company_name.localeCompare(b.alliance_company_name)
      ),
    })),

  updateAllianceCompany: (uuid, updatedCompany) =>
    set((state) => ({
      allianceCompanies: state.allianceCompanies.map((company) =>
        company.uuid === uuid ? updatedCompany : company
      ),
    })),

  deleteAllianceCompany: (uuid) =>
    set((state) => ({
      allianceCompanies: state.allianceCompanies.filter(
        (company) => company.uuid !== uuid
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
