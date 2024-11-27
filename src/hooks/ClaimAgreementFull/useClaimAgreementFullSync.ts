import { useEffect } from "react";
import { useClaimAgreementFull } from "./useClaimAgreementFull";
import { useClaimAgreementFullStore } from "@/stores/claim-agreement-fullStore";
import type {
  ClaimAgreementFullData,
  ClaimAgreementFullUpdateDTO,
} from "../../../app/types/claim-agreement-full";

export const useClaimAgreementFullSync = (token: string) => {
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    fetchItems,
  } = useClaimAgreementFull(token);

  const {
    setItems,
    setLoading,
    setError,
    addItem,
    updateItem: updateStoreItem,
    deleteItem: deleteStoreItem,
    restoreItem: restoreStoreItem,
  } = useClaimAgreementFullStore();

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

  const handleCreate = async (data: ClaimAgreementFullData) => {
    try {
      const newItem = await createItem(data);
      if (newItem) {
        await fetchItems();
      }
      return newItem;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creating item";
      setError(message);
      throw error;
    }
  };

  const handleUpdate = async (
    uuid: string,
    data: ClaimAgreementFullUpdateDTO
  ) => {
    try {
      const updatedItem = await updateItem(uuid, data);
      if (updatedItem) {
        await fetchItems();
      }
      return updatedItem;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error updating item";
      setError(message);
      throw error;
    }
  };

  const handleDelete = async (
    uuid: string
  ): Promise<ClaimAgreementFullData> => {
    try {
      // First get the item data before deletion
      const itemToDelete = apiItems.find((item) => item.uuid === uuid);
      if (!itemToDelete) {
        throw new Error("Item not found");
      }

      // Perform deletion
      await deleteItem(uuid);
      await fetchItems();

      // Return the deleted item data
      return itemToDelete;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error deleting item";
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
      return restoredItem;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error restoring item";
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
};
