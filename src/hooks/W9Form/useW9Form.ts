import { useState, useCallback, useEffect } from "react";
import type {
  W9FormData,
  W9FormCreateDTO,
  W9FormUpdateDTO,
  W9FormListResponse,
} from "../../../app/types/w9form";
import * as w9formActions from "../../../app/lib/actions/w9FormActions";

export const useW9Form = (token: string) => {
  const [items, setItems] = useState<W9FormData[]>([]);
  const [currentItem, setCurrentItem] = useState<W9FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response: W9FormListResponse = await w9formActions.getDataFetch(
        token
      );

      if (response.success && Array.isArray(response.data)) {
        setItems(response.data);
        setError(null);
      } else {
        setItems([]);
        setError(response.message || "Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
      setItems([]);
      setError(
        error instanceof Error ? error.message : "Failed to fetch items"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getItem = useCallback(
    async (uuid: string) => {
      if (!token) return;

      try {
        setLoading(true);
        const response = await w9formActions.getData(token, uuid);

        if (response.success && response.data) {
          setCurrentItem(response.data);
          setError(null);
          return response.data;
        } else {
          setCurrentItem(null);
          setError("No item found");
          throw new Error("No item found");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
        setCurrentItem(null);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch item";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const createItem = useCallback(
    async (data: W9FormCreateDTO) => {
      try {
        const createdItem = await w9formActions.createData(token, data);
        await fetchItems();
        return createdItem;
      } catch (error) {
        console.error("Error creating item:", error);
        setError(
          error instanceof Error ? error.message : "Failed to create item"
        );
        throw error;
      }
    },
    [token, fetchItems]
  );

  const updateItem = useCallback(
    async (uuid: string, data: W9FormUpdateDTO) => {
      try {
        const updatedItem = await w9formActions.updateData(token, uuid, data);
        setCurrentItem(updatedItem);
        await fetchItems();
        return updatedItem;
      } catch (error) {
        console.error("Error updating item:", error);
        setError(
          error instanceof Error ? error.message : "Failed to update item"
        );
        throw error;
      }
    },
    [token, fetchItems]
  );

  const deleteItem = useCallback(
    async (uuid: string) => {
      try {
        const response = await w9formActions.deleteData(token, uuid);

        if (response.success) {
          await fetchItems();
        } else {
          throw new Error(response.message || "Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        setError(
          error instanceof Error ? error.message : "Failed to delete item"
        );
        throw error;
      }
    },
    [token, fetchItems]
  );

  const restoreItem = useCallback(
    async (uuid: string) => {
      try {
        const restoredItem = await w9formActions.restoreData(token, uuid);
        setCurrentItem(restoredItem);
        await fetchItems();
        return restoredItem;
      } catch (error) {
        console.error("Error restoring item:", error);
        setError(
          error instanceof Error ? error.message : "Failed to restore item"
        );
        throw error;
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
