import { create } from "zustand";
import { ScopeSheetPresentationData } from "../../app/types/scope-sheet-presentation";

interface ScopeSheetPresentationStore {
  // State
  items: ScopeSheetPresentationData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Basic Actions
  setItems: (items: ScopeSheetPresentationData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // CRUD Actions
  addItem: (item: ScopeSheetPresentationData) => void;
  updateItem: (uuid: string, item: ScopeSheetPresentationData) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (item: ScopeSheetPresentationData) => void;

  // Selectors
  getFilteredItems: () => ScopeSheetPresentationData[];
}

export const useScopeSheetPresentationStore =
  create<ScopeSheetPresentationStore>((set, get) => ({
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
          (a, b) =>
            (a.photo_type || "").localeCompare(b.photo_type || "") ||
            (a.photo_order ?? 0) - (b.photo_order ?? 0)
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
        const searchFields = [
          item.photo_type,
          String(item.photo_order),
          item.photo_path,
        ].filter(Boolean);
        return searchFields.some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    },
  }));

export const selectActivePresentationItems = (
  state: ScopeSheetPresentationStore
) => state.items.filter((item) => !item.deleted_at);

export const selectDeletedPresentationItems = (
  state: ScopeSheetPresentationStore
) => state.items.filter((item) => item.deleted_at);
