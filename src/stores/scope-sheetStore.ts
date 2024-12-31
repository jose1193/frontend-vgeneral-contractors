// scopeSheetStore.ts
import { create } from "zustand";
import { ScopeSheetData } from "../../app/types/scope-sheet";

interface ScopeSheetStore {
  items: ScopeSheetData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Acciones básicas
  setItems: (items: ScopeSheetData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addItem: (item: ScopeSheetData) => void;
  updateItem: (uuid: string, item: Partial<ScopeSheetData>) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (uuid: string) => void;
  updateItemStatus: (uuid: string, isDeleted: boolean) => void;

  // Selectores
  getFilteredItems: () => ScopeSheetData[];
}

export const useScopeSheetStore = create<ScopeSheetStore>((set, get) => ({
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
        (a.scope_sheet_description || '').localeCompare(b.scope_sheet_description || '')
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
        item.scope_sheet_description,
        item.claim_id,
        item.uuid,
        item.generated_by,
      ];

      return searchableFields.some((field) => {
        if (field === null || field === undefined) return false;
        return String(field).toLowerCase().includes(searchTermLower);
      });
    });
  },
}));

// Selectores auxiliares
export const selectActiveItems = (store: ScopeSheetStore) =>
  store.items.filter((item) => !item.deleted_at);

export const selectDeletedItems = (store: ScopeSheetStore) =>
  store.items.filter((item) => item.deleted_at);