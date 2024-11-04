import { create } from "zustand";
import { PublicCompanyData } from "../../app/types/public-company";
// Define the public company data interface

interface PublicCompanyStore {
  publicCompanies: PublicCompanyData[];
  loading: boolean;
  error: string | null;
  setPublicCompanies: (companies: PublicCompanyData[]) => void;
  addPublicCompany: (company: PublicCompanyData) => void;
  updatePublicCompany: (uuid: string, company: PublicCompanyData) => void;
  deletePublicCompany: (uuid: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePublicCompanyStore = create<PublicCompanyStore>((set) => ({
  publicCompanies: [],
  loading: false,
  error: null,

  setPublicCompanies: (companies) => set({ publicCompanies: companies }),

  addPublicCompany: (company) =>
    set((state) => ({
      publicCompanies: [company, ...state.publicCompanies].sort((a, b) =>
        a.public_company_name.localeCompare(b.public_company_name)
      ),
    })),

  updatePublicCompany: (uuid, updatedCompany) =>
    set((state) => ({
      publicCompanies: state.publicCompanies.map((company) =>
        company.uuid === uuid ? updatedCompany : company
      ),
    })),

  deletePublicCompany: (uuid) =>
    set((state) => ({
      publicCompanies: state.publicCompanies.filter(
        (company) => company.uuid !== uuid
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
