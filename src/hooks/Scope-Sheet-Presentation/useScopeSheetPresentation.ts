// 2. Base Hook (useScopeSheetPresentation.ts)
import { useState, useCallback, useEffect } from "react";
import type {
  ScopeSheetPresentationData,
  ScopeSheetPresentationCreateDTO,
  ScopeSheetPresentationUpdateDTO,
  ScopeSheetPresentationGetResponse,
  ScopeSheetPresentationListResponse,
  ScopeSheetPresentationCreateResponse,
  ScopeSheetPresentationUpdateResponse,
  ScopeSheetPresentationRestoreResponse,
} from "../../../app/types/scope-sheet-presentation";
import * as presentationActions from "../../../app/lib/actions/scopeSheetPresentationActions";

export class ScopeSheetPresentationError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = "ScopeSheetPresentationError";
  }
}

export const useScopeSheetPresentation = (token: string) => {
  const [items, setItems] = useState<ScopeSheetPresentationData[]>([]);
  const [currentItem, setCurrentItem] =
    useState<ScopeSheetPresentationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const setErrorMessage = (error: unknown, defaultMessage: string) => {
    const errorMessage =
      error instanceof Error ? error.message : defaultMessage;
    setError(errorMessage);
    console.error(defaultMessage, error);
  };

  const fetchItems = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await presentationActions.getPresentationListFetch(
        token
      );

      if (response.success && Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        setErrorMessage(
          new Error(response.message || "Invalid data format received"),
          "Failed to fetch presentation items"
        );
      }
    } catch (error) {
      setErrorMessage(error, "Failed to fetch presentation items");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getItem = useCallback(
    async (uuid: string) => {
      if (!token) return null;

      try {
        setLoading(true);
        setError(null);
        const response = await presentationActions.getPresentationData(
          token,
          uuid
        );

        if (response.success && response.data) {
          setCurrentItem(response.data);
          return response.data;
        } else {
          setErrorMessage(
            new Error("No presentation item found"),
            "Failed to fetch presentation item"
          );
          return null;
        }
      } catch (error) {
        setErrorMessage(error, "Failed to fetch presentation item");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createItem = useCallback(
    async (data: ScopeSheetPresentationCreateDTO) => {
      try {
        setError(null);
        const newItem = await presentationActions.createPresentationData(
          token,
          data
        );
        if (newItem) {
          await fetchItems();
          return newItem;
        }
        return null;
      } catch (error) {
        setErrorMessage(error, "Failed to create presentation item");
        return null;
      }
    },
    [token, fetchItems]
  );

  const uploadImages = useCallback(
    async (scope_sheet_uuid: string, files: File[], photo_type: string) => {
      try {
        setError(null);
        const newItem = await presentationActions.uploadPresentationImages(
          token,
          scope_sheet_uuid,
          files,
          photo_type
        );
        if (newItem) {
          await fetchItems();
          return newItem;
        }
        return null;
      } catch (error) {
        setErrorMessage(error, "Failed to upload presentation images");
        return null;
      }
    },
    [token, fetchItems]
  );

  const updateItem = useCallback(
    async (
      uuid: string,
      scope_sheet_uuid: string,
      data: ScopeSheetPresentationUpdateDTO,
      files: File[] = []
    ) => {
      try {
        setError(null);
        const updatedItem = await presentationActions.updatePresentationData(
          token,
          uuid,
          scope_sheet_uuid,
          data,
          files
        );
        if (updatedItem) {
          setCurrentItem(updatedItem);
          await fetchItems();
          return updatedItem;
        }
        return null;
      } catch (error) {
        setErrorMessage(error, "Failed to update presentation item");
        return null;
      }
    },
    [token, fetchItems]
  );

  const deleteItem = useCallback(
    async (uuid: string) => {
      try {
        setError(null);
        const response = await presentationActions.deletePresentationData(
          token,
          uuid
        );
        if (response.success) {
          await fetchItems();
        }
        return response.success;
      } catch (error) {
        setErrorMessage(error, "Failed to delete presentation item");
        return false;
      }
    },
    [token, fetchItems]
  );

  const reorderImages = useCallback(
    async (scope_sheet_uuid: string, new_order: string[]) => {
      try {
        setError(null);
        const response = await presentationActions.reorderPresentationImages(
          token,
          {
            scope_sheet_uuid,
            new_order,
          }
        );
        if (response.success) {
          await fetchItems();
        }
        return response.success;
      } catch (error) {
        setErrorMessage(error, "Failed to reorder presentation images");
        return false;
      }
    },
    [token, fetchItems]
  );

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
    reorderImages,
    fetchItems,
    uploadImages,
  };
};
