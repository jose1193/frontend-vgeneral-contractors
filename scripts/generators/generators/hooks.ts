import { promises as fs } from "fs";
import path from "path";
import { GeneratorConfig } from "../types";
import { toKebabCase, ensureDirectoryExists } from "../utils";

export async function generateHooks(config: GeneratorConfig) {
  const { name, baseDir } = config;
  const dir = path.join(baseDir, "src/hooks", name);
  await ensureDirectoryExists(dir);

  // useItem hook
  const useItemContent = `import { useState, useCallback, useEffect } from 'react';
import type { 
  ${name}Data, 
  ${name}CreateDTO, 
  ${name}UpdateDTO,
  ${name}CreateResponse,
  ${name}UpdateResponse,
  ${name}RestoreResponse
} from '../../../app/types/${toKebabCase(name)}';
import * as ${toKebabCase(name)}Actions from '../../../app/lib/actions/${toKebabCase(name)}Actions';

export class ${name}Error extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "${name}Error";
  }
}

export const use${name} = (token: string) => {
  const [items, setItems] = useState<${name}Data[]>([]);
  const [currentItem, setCurrentItem] = useState<${name}Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setErrorMessage = (error: unknown, defaultMessage: string) => {
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    setError(errorMessage);
    console.error(defaultMessage, error);
  };

  const fetchItems = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await ${toKebabCase(name)}Actions.getDataFetch(token);

      if (response.success && Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        setErrorMessage(
          new Error(response.message || 'Invalid data format received'),
          'Failed to fetch items'
        );
      }
    } catch (error) {
      setErrorMessage(error, 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getItem = useCallback(async (uuid: string) => {
    if (!token) return null;

    try {
      setLoading(true);
      setError(null);
      const response: ${name}Data = await ${toKebabCase(name)}Actions.getData(token, uuid);

      if (response && response.uuid) {
        setCurrentItem(response);
        return response;
      } else {
        setErrorMessage(new Error('No item found'), 'Failed to fetch item');
        return null;
      }
    } catch (error) {
      setErrorMessage(error, 'Failed to fetch item');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createItem = useCallback(async (data: ${name}CreateDTO) => {
    try {
      setError(null);
      const newItem = await ${toKebabCase(name)}Actions.createData(token, data);
      await fetchItems();
      return newItem;
    } catch (error) {
      setErrorMessage(error, 'Failed to create item');
      return null;
    }
  }, [token, fetchItems]);

  const updateItem = useCallback(async (uuid: string, data: ${name}UpdateDTO) => {
    try {
      setError(null);
      const updatedItem = await ${toKebabCase(name)}Actions.updateData(token, uuid, data);
      if (updatedItem) {
        setCurrentItem(updatedItem);
        await fetchItems();
      }
      return updatedItem;
    } catch (error) {
      setErrorMessage(error, 'Failed to update item');
      return null;
    }
  }, [token, fetchItems]);

  const deleteItem = useCallback(async (uuid: string) => {
    try {
      setError(null);
      const response = await ${toKebabCase(name)}Actions.deleteData(token, uuid);
      return response.success;
    } catch (error) {
      setErrorMessage(error, 'Failed to delete item');
      return false;
    }
  }, [token]);

  const restoreItem = useCallback(async (uuid: string) => {
    try {
      setError(null);
      const restoredItem = await ${toKebabCase(name)}Actions.restoreData(token, uuid);
      if (restoredItem) {
        setCurrentItem(restoredItem);
      }
      return restoredItem;
    } catch (error) {
      setErrorMessage(error, 'Failed to restore item');
      return null;
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchItems();
    }
  }, [token, fetchItems]);

  return {
    items,
    currentItem,
    loading,
    error,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    fetchItems,
  };
};`;

  // useSyncItem hook
  const useSyncContent = `import { useEffect, useCallback } from 'react';
import { use${name} } from './use${name}';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import type { 
  ${name}Data, 
  ${name}CreateDTO, 
  ${name}UpdateDTO,
  ${name}CreateResponse,
  ${name}UpdateResponse,
  ${name}RestoreResponse
} from '../../../app/types/${toKebabCase(name)}';

interface Use${name}SyncReturn {
  loading: boolean;
  error: string | null;
  items: ${name}Data[];
  handleCreate: (data: ${name}CreateDTO) => Promise<${name}CreateResponse>;
  handleUpdate: (uuid: string, data: ${name}UpdateDTO) => Promise<${name}UpdateResponse>;
  handleDelete: (uuid: string) => Promise<void>;
  handleRestore: (uuid: string) => Promise<void>;
  getFilteredItems: () => ${name}Data[];
  refreshItems: () => Promise<void>;
}

export const use${name}Sync = (token: string): Use${name}SyncReturn => {
  const store = use${name}Store();
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem: apiUpdateItem,
    deleteItem: apiDeleteItem,
    restoreItem: apiRestoreItem,
    fetchItems,
  } = use${name}(token);

  useEffect(() => {
    const shouldSync = !store.items.length && apiItems && Array.isArray(apiItems) && apiItems.length > 0;
    if (shouldSync) {
      store.setItems(apiItems);
    }
  }, [apiItems]);

  useEffect(() => {
    store.setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (error) {
      store.setError(typeof error === 'string' ? error : 'An error occurred');
    }
  }, [error]);

  const handleCreate = useCallback(async (data: ${name}CreateDTO): Promise<${name}CreateResponse> => {
    try {
      const newItem = await createItem(data);
      if (!newItem) {
        throw new Error('Failed to create item');
      }
      store.addItem(newItem);
      return newItem;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error creating item";
      store.setError(message);
      throw error;
    }
  }, [createItem, store]);

  const handleUpdate = useCallback(async (
    uuid: string,
    data: ${name}UpdateDTO
  ): Promise<${name}UpdateResponse> => {
    try {
      const updatedItem = await apiUpdateItem(uuid, data);
      if (!updatedItem) {
        throw new Error('Failed to update item');
      }
      store.updateItem(uuid, updatedItem);
      return updatedItem;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error updating item";
      store.setError(message);
      throw error;
    }
  }, [apiUpdateItem, store]);

  const handleDelete = useCallback(async (uuid: string): Promise<void> => {
    if (!uuid) return;

    // Optimistic update
    store.updateItemStatus(uuid, true);
    
    try {
      await apiDeleteItem(uuid);
    } catch (error) {
      // Revert on error
      store.updateItemStatus(uuid, false);
      const message = error instanceof Error ? error.message : "Error deleting item";
      store.setError(message);
      throw error;
    }
  }, [apiDeleteItem, store]);

  const handleRestore = useCallback(async (uuid: string): Promise<void> => {
    if (!uuid) return;

    // Optimistic update
    store.updateItemStatus(uuid, false);
    
    try {
      await apiRestoreItem(uuid);
    } catch (error) {
      // Revert on error
      store.updateItemStatus(uuid, true);
      const message = error instanceof Error ? error.message : "Error restoring item";
      store.setError(message);
      throw error;
    }
  }, [apiRestoreItem, store]);

  return {
    loading,
    error,
    items: store.items,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleRestore,
    getFilteredItems: store.getFilteredItems,
    refreshItems: fetchItems,
  };
};`;

  await fs.writeFile(path.join(dir, `use${name}.ts`), useItemContent);
  await fs.writeFile(path.join(dir, `use${name}Sync.ts`), useSyncContent);
}