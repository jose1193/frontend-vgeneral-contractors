// hooks/useZoneSync.ts
import { useEffect } from "react";
import { useZones } from "./useZones";
import { useZoneStore } from "../../app/zustand/useZoneStore";
import { ZoneData, ZoneUpdateDTO } from "../../app/types/zone";

export const useZoneSync = (token: string) => {
  const {
    zones: apiZones,
    loading,
    error,
    createZone,
    updateZone,
    deleteZone,
    restoreZone,
    checkCodeAvailability,
    fetchZones,
  } = useZones(token);

  const {
    setZones,
    setLoading,
    setError,
    addZone,
    updateZone: updateStoreZone,
    deleteZone: deleteStoreZone,
    restoreZone: restoreStoreZone,
  } = useZoneStore();

  useEffect(() => {
    if (apiZones && apiZones.length > 0) {
      console.log("Setting zones in store:", apiZones);
      setZones(apiZones);
    }
  }, [apiZones, setZones]);

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  useEffect(() => {
    setError(error);
  }, [error, setError]);

  const handleCreate = async (data: ZoneData) => {
    try {
      const newZone = await createZone(data);
      if (newZone) {
        await fetchZones();
      }
      return newZone;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error creating zone";
      setError(message);
      throw error;
    }
  };

  const handleUpdate = async (uuid: string, data: ZoneUpdateDTO) => {
    try {
      const updatedZone = await updateZone(uuid, data);
      if (updatedZone) {
        await fetchZones();
      }
      return updatedZone;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error updating zone";
      setError(message);
      throw error;
    }
  };

  const handleDelete = async (uuid: string) => {
    try {
      await deleteZone(uuid);
      await fetchZones();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error deleting zone";
      setError(message);
      throw error;
    }
  };

  const handleRestore = async (uuid: string) => {
    try {
      const restoredZone = await restoreZone(uuid);
      if (restoredZone) {
        await fetchZones();
      }
      return restoredZone;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error restoring zone";
      setError(message);
      throw error;
    }
  };

  const handleCheckCodeAvailability = async (code: string, uuid?: string) => {
    try {
      return await checkCodeAvailability(code, uuid);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error checking code availability";
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
    handleCheckCodeAvailability,
    refreshZones: fetchZones,
  };
};
