// 1. Store (scope-sheet-presentationStore.ts)
import { create } from "zustand";
import { ScopeSheetPresentationData } from "../../app/types/scope-sheet-presentation";

interface ScopeSheetPresentationStore {
  items: ScopeSheetPresentationData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Basic actions
  setItems: (items: ScopeSheetPresentationData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // CRUD actions
  addItem: (item: ScopeSheetPresentationData) => void;
  updateItem: (uuid: string, item: Partial<ScopeSheetPresentationData>) => void;
  updateItemStatus: (uuid: string, isDeleted: boolean) => void;
  reorderImages: (reorderedItems: ScopeSheetPresentationData[]) => void;

  // Selectors
  getFilteredItems: () => ScopeSheetPresentationData[];
}

export const useScopeSheetPresentationStore = create<ScopeSheetPresentationStore>((set, get) => ({
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
        (a.photo_type || '').localeCompare(b.photo_type || '')
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

  reorderImages: (reorderedItems) => {
    set({ items: reorderedItems });
  },

  getFilteredItems: () => {
    const { items, searchTerm } = get();
    if (!searchTerm) return items;

    const searchTermLower = searchTerm.toLowerCase();
    
    return items.filter((item) => {
      const searchableFields = [
        item.photo_type,
        item.uuid,
        item.scope_sheet_id,
      ];

      return searchableFields.some((field) => {
        if (field === null || field === undefined) return false;
        return String(field).toLowerCase().includes(searchTermLower);
      });
    });
  },
}));

// Auxiliary selectors
export const selectActivePresentationItems = (store: ScopeSheetPresentationStore) =>
  store.items.filter((item) => !item.deleted_at);

export const selectDeletedPresentationItems = (store: ScopeSheetPresentationStore) =>
  store.items.filter((item) => item.deleted_at);
