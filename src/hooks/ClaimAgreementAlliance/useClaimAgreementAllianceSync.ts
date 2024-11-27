import { useEffect } from 'react';
import { useClaimAgreementAlliance } from './useClaimAgreementAlliance';
import { useClaimAgreementAllianceStore } from '@/stores/claim-agreement-allianceStore';
import type { 
  ClaimAgreementAllianceData, 
  ClaimAgreementAllianceUpdateDTO 
} from '../../../app/types/claim-agreement-alliance';

export const useClaimAgreementAllianceSync = (token: string) => {
  const {
    items: apiItems,
    loading,
    error,
    createItem,
    updateItem,
    deleteItem,
    restoreItem,
    fetchItems,
  } = useClaimAgreementAlliance(token);

  const {
    setItems,
    setLoading,
    setError,
    addItem,
    updateItem: updateStoreItem,
    deleteItem: deleteStoreItem,
    restoreItem: restoreStoreItem,
  } = useClaimAgreementAllianceStore();

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

  const handleCreate = async (data: ClaimAgreementAllianceData): Promise<ClaimAgreementAllianceData> => {
    try {
      const newItem = await createItem(data);
      if (newItem) {
        await fetchItems();
      }
      return newItem;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error creating item';
      setError(message);
      throw error;
    }
  };

  const handleUpdate = async (uuid: string, data: ClaimAgreementAllianceUpdateDTO): Promise<ClaimAgreementAllianceData> => {
    try {
      const updatedItem = await updateItem(uuid, data);
      if (updatedItem) {
        await fetchItems();
      }
      return updatedItem;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error updating item';
      setError(message);
      throw error;
    }
  };

  const handleDelete = async (uuid: string): Promise<ClaimAgreementAllianceData> => {
    try {
      const itemToDelete = apiItems.find(item => item.uuid === uuid);
      if (!itemToDelete) {
        throw new Error('Item not found');
      }
      await deleteItem(uuid);
      await fetchItems();
      return itemToDelete;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error deleting item';
      setError(message);
      throw error;
    }
  };

  const handleRestore = async (uuid: string): Promise<ClaimAgreementAllianceData> => {
    try {
      const restoredItem = await restoreItem(uuid);
      if (restoredItem) {
        await fetchItems();
      }
      return restoredItem;
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
};