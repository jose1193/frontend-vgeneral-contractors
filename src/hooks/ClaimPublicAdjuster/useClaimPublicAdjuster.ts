import { useState, useCallback, useEffect } from "react";
import type {
  ClaimPublicAdjusterData,
  ClaimPublicAdjusterCreateDTO,
  ClaimPublicAdjusterUpdateDTO,
  ClaimPublicAdjusterListResponse,
} from "../../../app/types/claim-public-adjuster";
import * as claimPublicAdjusterActions from "../../../app/lib/actions/claimPublicAdjusterActions";

export const useClaimPublicAdjuster = (token: string) => {
  const [items, setItems] = useState<ClaimPublicAdjusterData[]>([]);
  const [currentItem, setCurrentItem] =
    useState<ClaimPublicAdjusterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response: ClaimPublicAdjusterListResponse =
        await claimPublicAdjusterActions.getDataFetch(token);

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
        const response = await claimPublicAdjusterActions.getData(token, uuid);

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
    async (data: ClaimPublicAdjusterCreateDTO) => {
      try {
        const response = await claimPublicAdjusterActions.createData(
          token,
          data
        );

        if (response.success && response.data) {
          await fetchItems();
          return response.data;
        }
        throw new Error(response.message || "Failed to create item");
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
    async (uuid: string, data: ClaimPublicAdjusterUpdateDTO) => {
      try {
        const response = await claimPublicAdjusterActions.updateData(
          token,
          uuid,
          data
        );

        if (response.success && response.data) {
          setCurrentItem(response.data);
          await fetchItems();
          return response.data;
        }
        throw new Error(response.message || "Failed to update item");
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
        const response = await claimPublicAdjusterActions.deleteData(
          token,
          uuid
        );

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
        const response = await claimPublicAdjusterActions.restoreData(
          token,
          uuid
        );

        if (response.success && response.data) {
          setCurrentItem(response.data);
          await fetchItems();
          return response.data;
        }
        throw new Error(response.message || "Failed to restore item");
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
