// scripts/generators/generators/store.ts
import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateStore(config: GeneratorConfig) {
  const { name, baseDir } = config;

  const content = `import { create } from 'zustand';
import { ${name}Data } from '@/types/${toKebabCase(name)}';

interface ${name}Store {
  // Estado
  items: ${name}Data[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Acciones básicas
  setItems: (items: ${name}Data[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addItem: (item: ${name}Data) => void;
  updateItem: (uuid: string, item: ${name}Data) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (item: ${name}Data) => void;

  // Selectores
  getFilteredItems: () => ${name}Data[];
}

export const use${name}Store = create<${name}Store>((set, get) => ({
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

export const selectActiveItems = (state: ${name}Store) =>
  state.items.filter((item) => !item.deleted_at);

export const selectDeletedItems = (state: ${name}Store) =>
  state.items.filter((item) => item.deleted_at);`;

  const dir = path.join(baseDir, "stores");
  await ensureDirectoryExists(dir);
  await fs.writeFile(path.join(dir, `${toKebabCase(name)}Store.ts`), content);
}
