import { useEffect } from "react";
import { useClaimAgreement } from "./useClaimAgreement";
import { useClaimAgreementStore } from "@/stores/claim-agreementStore";
import type {
  ClaimAgreementData,
  ClaimAgreementUpdateDTO,
} from "../../../app/types/claim-agreement";

export const useClaimAgreementSync = (token: string) => {
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    fetchItems,
  } = useClaimAgreement(token);

  const {
    setItems,
    setLoading,
    setError,
    addItem,
    updateItem: updateStoreItem,
    deleteItem: deleteStoreItem,
    restoreItem: restoreStoreItem,
  } = useClaimAgreementStore();

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

  const handleCreate = async (data: ClaimAgreementData) => {
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

  const handleUpdate = async (uuid: string, data: ClaimAgreementUpdateDTO) => {
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

  const handleDelete = async (uuid: string) => {
    try {
      await deleteItem(uuid);
      await fetchItems();
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
