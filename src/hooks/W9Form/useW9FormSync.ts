import { useEffect } from "react";
import { useW9Form } from "./useW9Form";
import { useW9FormStore } from "@/stores/w9formStore";
import type {
  W9FormData,
  W9FormCreateDTO,
  W9FormUpdateDTO,
} from "../../../app/types/w9form";

// Tipo específico para la respuesta de creación
interface W9FormCreationResponse {
  uuid: string;
  document_path?: string;
  // otros campos que pueda devolver el backend
}

export const useW9FormSync = (token: string) => {
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    fetchItems,
  } = useW9Form(token);

  const {
    setItems,
    setLoading,
    setError,
    addItem,
    updateItem: updateStoreItem,
    deleteItem: deleteStoreItem,
    restoreItem: restoreStoreItem,
  } = useW9FormStore();

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

  const handleCreate = async (
    data: W9FormCreateDTO
  ): Promise<W9FormCreationResponse> => {
    try {
      const newItem = await createItem(data);

      // Verificar que tenemos los campos necesarios
      if (!newItem || !newItem.uuid) {
        throw new Error("Invalid response from server");
      }

      await fetchItems();

      return {
        uuid: newItem.uuid,
        document_path: newItem.document_path,
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creating item";
      setError(message);
      throw error;
    }
  };

  const handleUpdate = async (
    uuid: string,
    data: W9FormUpdateDTO
  ): Promise<void> => {
    try {
      const updatedItem = await updateItem(uuid, data);
      if (updatedItem) {
        await fetchItems();
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error updating item";
      setError(message);
      throw error;
    }
  };

  const handleDelete = async (uuid: string): Promise<void> => {
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

  const handleRestore = async (uuid: string): Promise<void> => {
    try {
      await restoreItem(uuid);
      await fetchItems();
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
