import { create } from "zustand";
import { ClaimAgreementAllianceData } from "../../app/types/claim-agreement-alliance";

interface ClaimAgreementAllianceStore {
  // Estado
  items: ClaimAgreementAllianceData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Acciones básicas
  setItems: (items: ClaimAgreementAllianceData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addItem: (item: ClaimAgreementAllianceData) => void;
  updateItem: (uuid: string, item: ClaimAgreementAllianceData) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (item: ClaimAgreementAllianceData) => void;

  // Selectores
  getFilteredItems: () => ClaimAgreementAllianceData[];
}

export const useClaimAgreementAllianceStore =
  create<ClaimAgreementAllianceStore>((set, get) => ({
    items: [],
    loading: false,
    error: null,
    searchTerm: "",

    setItems: (items) => set({ items }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSearchTerm: (term) => set({ searchTerm: term }),

    addItem: (item) =>
      set((state) => ({
        items: [item, ...state.items].sort(
          (a, b) => a.full_pdf_path?.localeCompare(b.full_pdf_path || "") || 0
        ),
      })),

    updateItem: (uuid, updatedItem) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid ? updatedItem : item
        ),
      })),

    deleteItem: (uuid) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid
            ? { ...item, deleted_at: new Date().toISOString() }
            : item
        ),
      })),

    restoreItem: (restoredItem) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === restoredItem.uuid
            ? { ...restoredItem, deleted_at: null }
            : item
        ),
      })),

    getFilteredItems: () => {
      const { items, searchTerm } = get();
      if (!searchTerm) return items;

      return items.filter((item) => {
        const searchFields = [item.full_pdf_path].filter(Boolean);
        return searchFields.some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    },
  }));

export const selectActiveItems = (state: ClaimAgreementAllianceStore) =>
  state.items.filter((item) => !item.deleted_at);

export const selectDeletedItems = (state: ClaimAgreementAllianceStore) =>
  state.items.filter((item) => item.deleted_at);
