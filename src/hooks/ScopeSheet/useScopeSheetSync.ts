// useScopeSheetSync.tsx
import { useEffect, useCallback } from "react";
import { useScopeSheet } from "./useScopeSheet";
import { useScopeSheetStore } from "@/stores/scope-sheetStore";
import type {
  ScopeSheetData,
  ScopeSheetCreateDTO,
  ScopeSheetUpdateDTO,
  ScopeSheetCreateResponse,
  ScopeSheetUpdateResponse,
  ScopeSheetRestoreResponse,
} from "../../../app/types/scope-sheet";

interface UseScopeSheetSyncReturn {
  loading: boolean;
  error: string | null;
  items: ScopeSheetData[];
  handleCreate: (data: ScopeSheetCreateDTO) => Promise<ScopeSheetCreateResponse>;
  handleUpdate: (uuid: string, data: ScopeSheetUpdateDTO) => Promise<ScopeSheetUpdateResponse>;
  handleDelete: (uuid: string) => Promise<void>;
  handleRestore: (uuid: string) => Promise<void>;
  getFilteredItems: () => ScopeSheetData[];
  refreshItems: () => Promise<void>;
}

export const useScopeSheetSync = (token: string): UseScopeSheetSyncReturn => {
  const store = useScopeSheetStore();
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem: apiUpdateItem,
    deleteItem: apiDeleteItem,
    restoreItem: apiRestoreItem,
    fetchItems,
  } = useScopeSheet(token);

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

  const handleCreate = useCallback(async (data: ScopeSheetCreateDTO): Promise<ScopeSheetCreateResponse> => {
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
    data: ScopeSheetUpdateDTO
  ): Promise<ScopeSheetUpdateResponse> => {
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
};
