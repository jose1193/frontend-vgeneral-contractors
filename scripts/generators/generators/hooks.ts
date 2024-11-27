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
  ${name}GetResponse,
  ${name}ListResponse,
  ${name}CreateResponse,
  ${name}UpdateResponse,
  ${name}RestoreResponse
} from '../../../app/types/${toKebabCase(name)}';
import * as ${toKebabCase(
    name
  )}Actions from '../../../app/lib/actions/${toKebabCase(name)}Actions';

export const use${name} = (token: string) => {
  const [items, setItems] = useState<${name}Data[]>([]);
  const [currentItem, setCurrentItem] = useState<${name}Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response: ${name}ListResponse = await ${toKebabCase(
    name
  )}Actions.getDataFetch(token);

      if (response.success && Array.isArray(response.data)) {
        setItems(response.data);
        setError(null);
      } else {
        setItems([]);
        setError(response.message || 'Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
      setError(error instanceof Error ? error.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getItem = useCallback(async (uuid: string) => {
    if (!token) return;

    try {
      setLoading(true);
      const response: ${name}GetResponse = await ${toKebabCase(
    name
  )}Actions.getData(token, uuid);

      if (response.success && response.data) {
        setCurrentItem(response.data);
        setError(null);
        return response.data;
      } else {
        setCurrentItem(null);
        setError(response.message || 'No item found');
        throw new Error('No item found');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      setCurrentItem(null);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch item';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const createItem = useCallback(async (data: ${name}CreateDTO) => {
    try {
      const newItem: ${name}CreateResponse = await ${toKebabCase(
    name
  )}Actions.createData(token, data);
      await fetchItems();
      return newItem;
    } catch (error) {
      console.error('Error creating item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [token, fetchItems]);

  const updateItem = useCallback(async (uuid: string, data: ${name}UpdateDTO) => {
    try {
      const updatedItem: ${name}UpdateResponse = await ${toKebabCase(
    name
  )}Actions.updateData(token, uuid, data);
      setCurrentItem(updatedItem);
      await fetchItems();
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [token, fetchItems]);

  const deleteItem = useCallback(async (uuid: string) => {
    try {
      const response = await ${toKebabCase(
        name
      )}Actions.deleteData(token, uuid);

      if (response.success) {
        await fetchItems();
      } else {
        throw new Error(response.message || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [token, fetchItems]);

  const restoreItem = useCallback(async (uuid: string) => {
    try {
      const restoredItem: ${name}RestoreResponse = await ${toKebabCase(
    name
  )}Actions.restoreData(token, uuid);
      setCurrentItem(restoredItem);
      await fetchItems();
      return restoredItem;
    } catch (error) {
      console.error('Error restoring item:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore item';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [token, fetchItems]);

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
  const useSyncContent = `import { useEffect } from 'react';
import { use${name} } from './use${name}';
import { use${name}Store } from '@/stores/${toKebabCase(name)}Store';
import type { 
  ${name}Data, 
  ${name}CreateDTO,
  ${name}UpdateDTO 
} from '../../../app/types/${toKebabCase(name)}';

export const use${name}Sync = (token: string) => {
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    fetchItems,
  } = use${name}(token);

  const {
    setItems,
    setLoading,
    setError,
    addItem,
    updateItem: updateStoreItem,
    deleteItem: deleteStoreItem,
    restoreItem: restoreStoreItem,
  } = use${name}Store();

  useEffect(() => {
    if (apiItems && apiItems.length > 0) {
      setItems(apiItems);
    }
  }, [apiItems, setItems]);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  const handleCreate = async (data: ${name}CreateDTO) => {
    try {
      const newItem = await createItem(data);
      if (newItem) {
        await fetchItems();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating item';
      setError(message);
      throw error;
    }
  };

  const handleUpdate = async (uuid: string, data: ${name}UpdateDTO) => {
    try {
      const updatedItem = await updateItem(uuid, data);
      if (updatedItem) {
        await fetchItems();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating item';
      setError(message);
      throw error;
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      await deleteItem(uuid);
      await fetchItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting item';
      setError(message);
      throw error;
    }
  };

  const handleRestore = async (uuid: string) => {
    try {
      const restoredItem = await restoreItem(uuid);
      if (restoredItem) {
        await fetchItems();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error restoring item';
      setError(message);
      throw error;
    }
  };

  return {
    loading,
    error,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleRestore,
    refreshItems: fetchItems,
  };
}`;

  await fs.writeFile(path.join(dir, `use${name}.ts`), useItemContent);
  await fs.writeFile(path.join(dir, `use${name}Sync.ts`), useSyncContent);
}
