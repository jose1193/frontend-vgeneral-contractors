// scopeSheetStore.ts
import { create } from "zustand";
import { ScopeSheetExportData } from "../../app/types/scope-sheet-export";

interface ScopeSheetExportStore {
  items: ScopeSheetExportData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Acciones básicas
  setItems: (items: ScopeSheetExportData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addItem: (item: ScopeSheetExportData) => void;
  updateItem: (uuid: string, item: Partial<ScopeSheetExportData>) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (uuid: string) => void;
  updateItemStatus: (uuid: string, isDeleted: boolean) => void;

  // Selectores
  getFilteredItems: () => ScopeSheetExportData[];
}

export const useScopeSheetExportStore = create<ScopeSheetExportStore>(
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
        items: [item, ...state.items].sort((a, b) =>
          (a.full_pdf_path || "").localeCompare(b.full_pdf_path || "")
        ),
      })),

    updateItem: (uuid, updatedItem) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid ? { ...item, ...updatedItem } : item
        ),
      })),

    updateItemStatus: (uuid, isDeleted) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid
            ? {
                ...item,
                deleted_at: isDeleted ? new Date().toISOString() : null,
              }
            : item
        ),
      })),

    deleteItem: (uuid) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid
            ? { ...item, deleted_at: new Date().toISOString() }
            : item
        ),
      }));
    },

    restoreItem: (uuid) => {
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid ? { ...item, deleted_at: null } : item
        ),
      }));
    },

    getFilteredItems: () => {
      const { items, searchTerm } = get();
      if (!searchTerm) return items;

      const searchTermLower = searchTerm.toLowerCase();

      return items.filter((item) => {
        const searchableFields = [
          item.full_pdf_path,

          item.uuid,
          item.generated_by,
        ];

        return searchableFields.some((field) => {
          if (field === null || field === undefined) return false;
          return String(field).toLowerCase().includes(searchTermLower);
        });
      });
    },
  })
);

// Selectores auxiliares
export const selectActiveItems = (store: ScopeSheetExportStore) =>
  store.items.filter((item) => !item.deleted_at);

export const selectDeletedItems = (store: ScopeSheetExportStore) =>
  store.items.filter((item) => item.deleted_at);
