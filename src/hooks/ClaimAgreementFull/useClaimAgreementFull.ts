import { useState, useCallback, useEffect } from "react";
import type {
  ClaimAgreementFullData,
  ClaimAgreementFullCreateDTO,
  ClaimAgreementFullUpdateDTO,
  ClaimAgreementFullListResponse,
} from "../../../app/types/claim-agreement-full";
import * as claimagreementFullActions from "../../../app/lib/actions/claimagreementFullActions";

export const useClaimAgreementFull = (token: string) => {
  const [items, setItems] = useState<ClaimAgreementFullData[]>([]);
  const [currentItem, setCurrentItem] = useState<ClaimAgreementFullData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response: ClaimAgreementFullListResponse =
        await claimagreementFullActions.getDataFetch(token);

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
        const response = await claimagreementFullActions.getData(token, uuid);

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
    async (data: ClaimAgreementFullCreateDTO) => {
      try {
        const response = await claimagreementFullActions.createData(
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
    async (uuid: string, data: ClaimAgreementFullUpdateDTO) => {
      try {
        const response = await claimagreementFullActions.updateData(
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
        const response = await claimagreementFullActions.deleteData(
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
        const response = await claimagreementFullActions.restoreData(
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
