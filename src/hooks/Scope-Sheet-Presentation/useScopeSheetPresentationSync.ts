// 3. Sync Hook (useScopeSheetPresentationSync.ts)
import { useEffect, useCallback, useRef } from "react";
import { useScopeSheetPresentation } from "./useScopeSheetPresentation";
import { useScopeSheetPresentationStore } from "../../stores/useScopeSheetPresentationStore";
import type {
  ScopeSheetPresentationData,
  ScopeSheetPresentationCreateDTO,
  ScopeSheetPresentationUpdateDTO,
  ScopeSheetPresentationCreateResponse,
  ScopeSheetPresentationUpdateResponse,
} from "../../../app/types/scope-sheet-presentation";

interface UseScopeSheetPresentationSyncReturn {
  loading: boolean;
  error: string | null;
  items: ScopeSheetPresentationData[];
  handleCreate: (
    data: ScopeSheetPresentationCreateDTO
  ) => Promise<ScopeSheetPresentationCreateResponse>;
  handleUpdate: (
    uuid: string,
    data: ScopeSheetPresentationUpdateDTO & { scope_sheet_uuid: string },
    files?: File[]
  ) => Promise<ScopeSheetPresentationUpdateResponse>;
  handleDelete: (uuid: string) => Promise<void>;
  handleReorderImages: (
    scope_sheet_uuid: string,
    new_order: string[]
  ) => Promise<void>;
  getFilteredItems: () => ScopeSheetPresentationData[];
  refreshItems: () => Promise<void>;
}

export const useScopeSheetPresentationSync = (
  token: string
): UseScopeSheetPresentationSyncReturn => {
  const store = useScopeSheetPresentationStore();
  const prevStateRef = useRef({
    loading: store.loading,
    error: store.error,
    itemsLength: store.items.length,
  });

  const {
    items: apiItems,
    loading: apiLoading,
    error: apiError,
    createItem,
    updateItem: apiUpdateItem,
    deleteItem: apiDeleteItem,
    reorderImages: apiReorderImages,
    fetchItems,
  } = useScopeSheetPresentation(token);

  // Sync items only when API items change
  useEffect(() => {
    const shouldSync =
      !prevStateRef.current.itemsLength &&
      apiItems &&
      Array.isArray(apiItems) &&
      apiItems.length > 0;

    if (shouldSync) {
      store.setItems(apiItems);
      prevStateRef.current.itemsLength = apiItems.length;
    }
  }, [apiItems, store]);

  // Sync loading state only when API loading changes
  useEffect(() => {
    if (prevStateRef.current.loading !== apiLoading) {
      store.setLoading(apiLoading);
      prevStateRef.current.loading = apiLoading;
    }
  }, [apiLoading, store]);

  // Sync error state only when API error changes
  useEffect(() => {
    const errorMessage = apiError
      ? typeof apiError === "string"
        ? apiError
        : "An error occurred"
      : null;

    if (prevStateRef.current.error !== errorMessage) {
      store.setError(errorMessage);
      prevStateRef.current.error = errorMessage;
    }
  }, [apiError, store]);

  const handleCreate = useCallback(
    async (
      data: ScopeSheetPresentationCreateDTO
    ): Promise<ScopeSheetPresentationCreateResponse> => {
      try {
        const newItem = await createItem(data);
        if (!newItem) {
          throw new Error("Failed to create presentation item");
        }
        store.addItem(newItem);
        return newItem;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error creating presentation item";
        store.setError(message);
        throw error;
      }
    },
    [createItem, store]
  );

  const handleUpdate = useCallback(
    async (
      uuid: string,
      data: ScopeSheetPresentationUpdateDTO & { scope_sheet_uuid: string },
      files?: File[]
    ): Promise<ScopeSheetPresentationUpdateResponse> => {
      try {
        const { scope_sheet_uuid, ...updateData } = data;
        const updatedItem = await apiUpdateItem(
          uuid,
          scope_sheet_uuid,
          updateData,
          files || []
        );
        if (!updatedItem) {
          throw new Error("Failed to update presentation item");
        }
        store.updateItem(uuid, updatedItem);
        return updatedItem;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Error updating presentation item";
        store.setError(message);
        throw error;
      }
    },
    [apiUpdateItem, store]
  );

  const handleDelete = useCallback(
    async (uuid: string): Promise<void> => {
      if (!uuid) return;

      store.setLoading(true);
      try {
        // Optimistic update
        store.updateItemStatus(uuid, true);
        await apiDeleteItem(uuid);
      } catch (error) {
        // Revert on error
        store.updateItemStatus(uuid, false);
        const message =
          error instanceof Error
            ? error.message
            : "Error deleting presentation item";
        store.setError(message);
        throw error;
      } finally {
        store.setLoading(false);
      }
    },
    [apiDeleteItem, store]
  );

  const handleReorderImages = useCallback(
    async (scope_sheet_uuid: string, new_order: string[]): Promise<void> => {
      try {
        const response = await apiReorderImages(scope_sheet_uuid, new_order);
        if (response) {
          await fetchItems();
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Error reordering images";
        store.setError(message);
        throw error;
      }
    },
    [apiReorderImages, fetchItems, store]
  );

  return {
    loading: store.loading,
    error: store.error,
    items: store.items,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleReorderImages,
    getFilteredItems: store.getFilteredItems,
    refreshItems: fetchItems,
  };
};
