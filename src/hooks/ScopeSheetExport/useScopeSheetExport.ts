import { useState, useCallback, useEffect } from "react";
import {
  ScopeSheetExportData,
  ScopeSheetExportCreateDTO,
  ScopeSheetExportUpdateDTO,
  ScopeSheetExportListResponse,
  ScopeSheetExportDeleteResponse,
  ScopeSheetExportCreateResponse,
  ScopeSheetExportUpdateResponse,
  ScopeSheetExportRestoreResponse,
  ScopeSheetExportGetResponse,
} from "../../../app/types/scope-sheet-export";
import * as scopeSheetExportActions from "../../../app/lib/actions/scopeSheetExportActions";

export const useScopeSheetExport = (token: string) => {
  const [items, setItems] = useState<ScopeSheetExportData[]>([]);
  const [currentItem, setCurrentItem] = useState<ScopeSheetExportData | null>(
    null
  );
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
      const response: ScopeSheetExportListResponse =
        await scopeSheetExportActions.getDataFetch(token);

      if (response.success && Array.isArray(response.data)) {
        setItems(response.data);
      } else {
        setErrorMessage(
          new Error(response.message || "Invalid data format received"),
          "Failed to fetch items"
        );
      }
    } catch (error) {
      setErrorMessage(error, "Failed to fetch items");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateItem = useCallback(
    async (uuid: string, data: ScopeSheetExportUpdateDTO) => {
      try {
        setError(null);
        const updatedItem: ScopeSheetExportUpdateResponse =
          await scopeSheetExportActions.updateData(token, uuid, data);
        setCurrentItem(updatedItem);
        await fetchItems();
        return updatedItem;
      } catch (error) {
        setErrorMessage(error, "Failed to update item");
        return null;
      }
    },
    [token, fetchItems]
  );

  const deleteItem = useCallback(
    async (uuid: string) => {
      try {
        setError(null);
        const response: ScopeSheetExportDeleteResponse =
          await scopeSheetExportActions.deleteData(token, uuid);
        if (response.success) {
          await fetchItems();
          return true;
        }
        setErrorMessage(
          new Error(response.message || "Delete failed"),
          "Failed to delete item"
        );
        return false;
      } catch (error) {
        setErrorMessage(error, "Failed to delete item");
        return false;
      }
    },
    [token, fetchItems]
  );

  const restoreItem = useCallback(
    async (uuid: string) => {
      try {
        setError(null);
        const restoredItem: ScopeSheetExportRestoreResponse =
          await scopeSheetExportActions.restoreData(token, uuid);
        setCurrentItem(restoredItem);
        await fetchItems();
        return restoredItem;
      } catch (error) {
        setErrorMessage(error, "Failed to restore item");
        return null;
      }
    },
    [token, fetchItems]
  );

  const getItem = useCallback(
    async (uuid: string) => {
      try {
        setError(null);
        const response: ScopeSheetExportGetResponse =
          await scopeSheetExportActions.getData(token, uuid);
        if (response.success && response.data) {
          setCurrentItem(response.data);
          return response.data;
        }
        setErrorMessage(
          new Error("Invalid data format received"),
          "Failed to get item"
        );
        return null;
      } catch (error) {
        setErrorMessage(error, "Failed to get item");
        return null;
      }
    },
    [token]
  );

  const createItem = useCallback(
    async (data: ScopeSheetExportCreateDTO) => {
      try {
        setError(null);
        const response: ScopeSheetExportCreateResponse =
          await scopeSheetExportActions.createData(token, data);
        if (response) {
          setCurrentItem(response);
          await fetchItems();
          return response;
        }
        setErrorMessage(
          new Error("Invalid data format received"),
          "Failed to create item"
        );
        return null;
      } catch (error) {
        setErrorMessage(error, "Failed to create item");
        return null;
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
    restoreItem,
    fetchItems,
  };
};
