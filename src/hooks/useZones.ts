import { useState, useCallback, useEffect } from "react";
import {
  ZoneData,
  ZoneCreateDTO,
  ZoneUpdateDTO,
  ZoneListResponse,
  ZoneResponse,
  ZoneDeleteResponse,
  ZoneRestoreResponse,
} from "../../app/types/zone";
import * as zoneActions from "../../app/lib/actions/zoneActions";

export const useZones = (token: string) => {
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [currentZone, setCurrentZone] = useState<ZoneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchZones = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response: ZoneListResponse = await zoneActions.getDataFetch(token);
      console.log("Fetch response:", response);

      if (response.success && Array.isArray(response.data)) {
        setZones(response.data);
        setError(null);
      } else {
        setZones([]);
        setError(response.message || "Invalid data format received");
      }
    } catch (error) {
      console.error("Error fetching zones:", error);
      setZones([]);
      setError(
        error instanceof Error ? error.message : "Failed to fetch zones"
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  const getZone = useCallback(
    async (uuid: string) => {
      if (!token) return;

      try {
        setLoading(true);
        const zoneData: ZoneData = await zoneActions.getData(token, uuid);
        console.log("Get zone response:", zoneData);

        if (zoneData && zoneData.uuid) {
          setCurrentZone(zoneData);
          setError(null);
          return zoneData;
        } else {
          setCurrentZone(null);
          setError("No zone found");
          throw new Error("No zone found");
        }
      } catch (error) {
        console.error("Error fetching zone:", error);
        setCurrentZone(null);
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch zone";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchZones();
    }
  }, [token, fetchZones]);

  const createZone = useCallback(
    async (data: ZoneData) => {
      try {
        const newZone = await zoneActions.createData(token, data);
        console.log("Create response:", newZone);

        if (newZone) {
          await fetchZones();
          return newZone;
        }

        // This is where the error was - fixed the throw syntax
        throw new Error("Failed to create zone");
      } catch (error) {
        console.error("Error creating zone:", error);
        setError("Failed to create zone");
        throw error;
      }
    },
    [token, fetchZones]
  );

  const updateZone = useCallback(
    async (uuid: string, data: ZoneUpdateDTO) => {
      try {
        const zoneData: ZoneData = await zoneActions.updateData(
          token,
          uuid,
          data
        );
        console.log("Update response:", zoneData);

        if (zoneData && zoneData.uuid) {
          setCurrentZone(zoneData);
          await fetchZones();
          return zoneData;
        }
        throw new Error("Failed to update zone");
      } catch (error) {
        console.error("Error updating zone:", error);
        setError(
          error instanceof Error ? error.message : "Failed to update zone"
        );
        throw error;
      }
    },
    [token, fetchZones]
  );
  const deleteZone = useCallback(
    async (uuid: string) => {
      try {
        const response: ZoneDeleteResponse = await zoneActions.deleteData(
          token,
          uuid
        );
        console.log("Delete response:", response);

        if (response.success) {
          await fetchZones();
        } else {
          throw new Error(response.message || "Failed to delete zone");
        }
      } catch (error) {
        console.error("Error deleting zone:", error);
        setError("Failed to delete zone");
        throw error;
      }
    },
    [token, fetchZones]
  );

  const restoreZone = useCallback(
    async (uuid: string) => {
      try {
        const zoneData: ZoneData = await zoneActions.restoreData(token, uuid);
        console.log("Restore response:", zoneData);

        if (zoneData && zoneData.uuid) {
          setCurrentZone(zoneData);
          await fetchZones();
          return zoneData;
        }
        throw new Error("Failed to update zone");
      } catch (error) {
        console.error("Error updating zone:", error);
        setError(
          error instanceof Error ? error.message : "Failed to update zone"
        );
        throw error;
      }
    },
    [token, fetchZones]
  );

  const checkCodeAvailability = useCallback(
    async (code: string, uuid?: string) => {
      try {
        return await zoneActions.checkZoneCodeAvailable(token, code, uuid);
      } catch (error) {
        console.error("Error checking code availability:", error);
        throw error;
      }
    },
    [token]
  );

  return {
    zones,
    currentZone,
    loading,
    error,
    getZone,
    createZone,
    updateZone,
    deleteZone,
    restoreZone,
    checkCodeAvailability,
    fetchZones,
  };
};
