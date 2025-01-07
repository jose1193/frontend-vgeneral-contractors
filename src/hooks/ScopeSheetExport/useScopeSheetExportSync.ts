// useScopeSheetSync.tsx
import { useEffect, useCallback } from "react";
import { useScopeSheetExport } from "./useScopeSheetExport";
import { useScopeSheetExportStore } from "../../stores/scope-sheetExportStore";
import {
  ScopeSheetExportData,
  ScopeSheetExportCreateDTO,
  ScopeSheetExportUpdateDTO,
  ScopeSheetExportUpdateResponse,
} from "../../../app/types/scope-sheet-export";

interface UseScopeSheetSyncReturn {
  loading: boolean;
  error: string | null;
  items: ScopeSheetExportData[];
  handleCreate: (
    data: ScopeSheetExportCreateDTO
  ) => Promise<ScopeSheetExportData | null>;
  handleUpdate: (
    uuid: string,
    data: ScopeSheetExportUpdateDTO
  ) => Promise<ScopeSheetExportUpdateResponse>;
  handleDelete: (uuid: string) => Promise<void>;
  handleRestore: (uuid: string) => Promise<void>;
  getFilteredItems: () => ScopeSheetExportData[];
  refreshItems: () => Promise<void>;
}

export const useScopeSheetExportSync = (
  token: string
): UseScopeSheetSyncReturn => {
  const store = useScopeSheetExportStore();
  const {
    items: apiItems,
    loading: apiLoading,
    error: apiError,
    createItem,
    updateItem: apiUpdateItem,
    deleteItem: apiDeleteItem,
    restoreItem: apiRestoreItem,
    fetchItems,
  } = useScopeSheetExport(token);

  // Sync items only when apiItems changes
  useEffect(() => {
    const shouldSync =
      !store.items.length &&
      apiItems &&
      Array.isArray(apiItems) &&
      apiItems.length > 0;
    if (shouldSync) {
      store.setItems(apiItems);
    }
  }, [apiItems, store]);

  // Set initial loading state only once
  useEffect(() => {
    if (store.loading !== apiLoading) {
      store.setLoading(apiLoading);
    }
  }, [apiLoading, store]);

  // Set error only when it changes
  useEffect(() => {
    if (apiError && store.error !== apiError) {
      store.setError(
        typeof apiError === "string" ? apiError : "An error occurred"
      );
    }
  }, [apiError, store]);

  const handleCreate = useCallback(
    async (
      data: ScopeSheetExportCreateDTO
    ): Promise<ScopeSheetExportData | null> => {
      try {
        const newItem = await createItem(data);
        if (!newItem) {
          throw new Error("Failed to create export");
        }
        store.addItem(newItem);
        return newItem;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error creating export";
        store.setError(message);
        throw error;
      }
    },
    [createItem, store]
  );

  const handleUpdate = useCallback(
    async (
      uuid: string,
      data: ScopeSheetExportUpdateDTO
    ): Promise<ScopeSheetExportUpdateResponse> => {
      try {
        const updatedItem = await apiUpdateItem(uuid, data);
        if (!updatedItem) {
          throw new Error("Failed to update item");
        }
        store.updateItem(uuid, updatedItem);
        return updatedItem;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error updating item";
        store.setError(message);
        throw error;
      }
    },
    [apiUpdateItem, store]
  );

  const handleDelete = useCallback(
    async (uuid: string): Promise<void> => {
      if (!uuid) return;

      // Optimistic update
      store.updateItemStatus(uuid, true);

      try {
        await apiDeleteItem(uuid);
      } catch (error) {
        // Revert on error
        store.updateItemStatus(uuid, false);
        const message =
          error instanceof Error ? error.message : "Error deleting item";
        store.setError(message);
        throw error;
      }
    },
    [apiDeleteItem, store]
  );

  const handleRestore = useCallback(
    async (uuid: string): Promise<void> => {
      if (!uuid) return;

      // Optimistic update
      store.updateItemStatus(uuid, false);

      try {
        await apiRestoreItem(uuid);
      } catch (error) {
        // Revert on error
        store.updateItemStatus(uuid, true);
        const message =
          error instanceof Error ? error.message : "Error restoring item";
        store.setError(message);
        throw error;
      }
    },
    [apiRestoreItem, store]
  );

  return {
    loading: store.loading,
    error: store.error,
    items: store.items,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleRestore,
    getFilteredItems: store.getFilteredItems,
    refreshItems: fetchItems,
  };
};
