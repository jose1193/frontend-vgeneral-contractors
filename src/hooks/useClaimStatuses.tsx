import { useState, useEffect, useCallback } from "react";
import { ClaimStatusData } from "../../app/types/claim-status";
import * as claimStatusActions from "../../app/lib/actions/claimStatusActions";

export const useClaimStatuses = (token: string) => {
  const [claimStatuses, setClaimStatuses] = useState<ClaimStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaimStatuses = useCallback(async () => {
    try {
      const response = await claimStatusActions.getClaimStatuses(token);
      console.log("Fetched claim statuses response:", response);

      if (response.success && Array.isArray(response.data)) {
        setClaimStatuses(response.data);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setError("Received invalid data format");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching claim statuses:", err);
      setError("Failed to fetch claim statuses");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClaimStatuses();
  }, [fetchClaimStatuses]);

  const createClaimStatus = async (statusData: ClaimStatusData) => {
    try {
      const newClaimStatus = await claimStatusActions.createClaimStatus(
        token,
        statusData
      );
      setClaimStatuses([...claimStatuses, newClaimStatus]);
    } catch (err) {
      setError("Failed to create claim status");
    }
  };

  const updateClaimStatus = async (
    uuid: string,
    statusData: ClaimStatusData
  ) => {
    try {
      const updatedClaimStatus = await claimStatusActions.updateClaimStatus(
        token,
        uuid,
        statusData
      );
      setClaimStatuses(
        claimStatuses.map((status) =>
          status.uuid === uuid ? updatedClaimStatus : status
        )
      );
    } catch (err) {
      setError("Failed to update claim status");
    }
  };

  const deleteClaimStatus = useCallback(
    async (uuid: string) => {
      console.log("Attempting to delete claim status with uuid:", uuid);
      try {
        await claimStatusActions.deleteClaimStatus(token, uuid);
        console.log("Claim status deleted successfully");

        // Update the local state
        setClaimStatuses((prevStatuses) =>
          prevStatuses.map((status) =>
            status.uuid === uuid ? { ...status, active: false } : status
          )
        );

        // Fetch the updated list of claim statuses
        await fetchClaimStatuses();
      } catch (err) {
        console.error("Error deleting claim status:", err);
        setError("Failed to delete claim status");
      }
    },
    [token, fetchClaimStatuses]
  );

  const restoreClaimStatus = useCallback(
    async (uuid: string) => {
      try {
        await claimStatusActions.restoreClaimStatus(token, uuid);
        console.log("Claim status restored successfully");

        // Fetch the updated list of claim statuses
        await fetchClaimStatuses();
      } catch (err) {
        console.error("Error restoring claim status:", err);
        setError("Failed to restore claim status");
      }
    },
    [token, fetchClaimStatuses]
  );

  return {
    claimStatuses,
    loading,
    error,
    createClaimStatus,
    updateClaimStatus,
    deleteClaimStatus,
    restoreClaimStatus,
  };
};
