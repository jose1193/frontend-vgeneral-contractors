import { create } from "zustand";
import { ClaimPublicAdjusterData } from "../../app/types/claim-public-adjuster";

interface ClaimPublicAdjusterStore {
  // Estado
  items: ClaimPublicAdjusterData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Acciones básicas
  setItems: (items: ClaimPublicAdjusterData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addItem: (item: ClaimPublicAdjusterData) => void;
  updateItem: (uuid: string, item: ClaimPublicAdjusterData) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (item: ClaimPublicAdjusterData) => void;

  // Selectores
  getFilteredItems: () => ClaimPublicAdjusterData[];
}

export const useClaimPublicAdjusterStore = create<ClaimPublicAdjusterStore>(
  (set, get) => ({
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
  })
);

export const selectActiveItems = (state: ClaimPublicAdjusterStore) =>
  state.items.filter((item) => !item.deleted_at);

export const selectDeletedItems = (state: ClaimPublicAdjusterStore) =>
  state.items.filter((item) => item.deleted_at);
