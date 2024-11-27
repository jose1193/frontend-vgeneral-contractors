import { create } from 'zustand';
import { W9FormData } from '../../app/types/w9form';

interface W9FormStore {
  // Estado
  items: W9FormData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Acciones básicas
  setItems: (items: W9FormData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addItem: (item: W9FormData) => void;
  updateItem: (uuid: string, item: W9FormData) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (item: W9FormData) => void;

  // Selectores
  getFilteredItems: () => W9FormData[];
}

export const useW9FormStore = create<W9FormStore>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  searchTerm: '',

  setItems: (items) => set({ items }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchTerm: (term) => set({ searchTerm: term }),

  addItem: (item) =>
    set((state) => ({
      items: [item, ...state.items].sort((a, b) =>
         a.name?.localeCompare(b.name || '') || 0
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
      const searchFields = [item.name].filter(Boolean);
      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  },
}));

export const selectActiveItems = (state: W9FormStore) =>
  state.items.filter((item) => !item.deleted_at);

export const selectDeletedItems = (state: W9FormStore) =>
  state.items.filter((item) => item.deleted_at);