import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateStore(config: GeneratorConfig) {
  const { name, baseDir } = config;
  const dir = path.join(baseDir, "src/stores");
  await ensureDirectoryExists(dir);

  const content = `import { create } from 'zustand';
import { ${name}Data } from '../../app/types/${toKebabCase(name)}';

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
  updateItem: (uuid: string, item: Partial<${name}Data>) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (uuid: string) => void;
  updateItemStatus: (uuid: string, isDeleted: boolean) => void;

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
        (a.${name.toLowerCase()}_description || '').localeCompare(b.${name.toLowerCase()}_description || '')
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
        item.${name.toLowerCase()}_description,
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
export const selectActiveItems = (store: ${name}Store) =>
  store.items.filter((item) => !item.deleted_at);

export const selectDeletedItems = (store: ${name}Store) =>
  store.items.filter((item) => item.deleted_at);
`;

  await fs.writeFile(path.join(dir, `${toKebabCase(name)}Store.ts`), content);
}