import { useEffect } from 'react';
import { useClaimPublicAdjuster } from './useClaimPublicAdjuster';
import { useClaimPublicAdjusterStore } from '@/stores/claim-public-adjusterStore';
import type { 
  ClaimPublicAdjusterData, 
  ClaimPublicAdjusterUpdateDTO 
} from '../../../app/types/claim-public-adjuster';

export const useClaimPublicAdjusterSync = (token: string) => {
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    fetchItems,
  } = useClaimPublicAdjuster(token);

  const {
    setItems,
    setLoading,
    setError,
    addItem,
    updateItem: updateStoreItem,
    deleteItem: deleteStoreItem,
    restoreItem: restoreStoreItem,
  } = useClaimPublicAdjusterStore();

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

  const handleCreate = async (data: ClaimPublicAdjusterData) => {
    try {
      const newItem = await createItem(data);
      if (newItem) {
        await fetchItems();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating item';
      setError(message);
      throw error;
    }
  };

  const handleUpdate = async (uuid: string, data: ClaimPublicAdjusterUpdateDTO) => {
    try {
      const updatedItem = await updateItem(uuid, data);
      if (updatedItem) {
        await fetchItems();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating item';
      setError(message);
      throw error;
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      await deleteItem(uuid);
      await fetchItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting item';
      setError(message);
      throw error;
    }
  };

  const handleRestore = async (uuid: string) => {
    try {
      await restoreItem(uuid);
      await fetchItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error restoring item';
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
}