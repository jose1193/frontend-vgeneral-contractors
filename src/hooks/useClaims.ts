import { useState, useEffect, useCallback } from "react";
import { ClaimsData } from "../../app/types/claims";
import * as claimActions from "../../app/lib/actions/claimsActions";

export const useClaims = (token: string) => {
  const [claims, setClaims] = useState<ClaimsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    try {
      setLoading(true);
      const response = await claimActions.getDataFetch(token);
      console.log("Fetched claims response:", response);

      if (response.success && Array.isArray(response.data)) {
        setClaims(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setClaims([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching claims:", err);
      setClaims([]);
      setError("Failed to fetch claims");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  const createClaim = async (
    claimData: ClaimsData
  ): Promise<string | undefined> => {
    try {
      const newClaim = await claimActions.createData(token, claimData);
      setClaims((prevClaims) => [...prevClaims, newClaim]);
      return newClaim.uuid;
    } catch (err) {
      console.error("Failed to create claim:", err);
      setError("Failed to create claim");
      throw err;
    }
  };

  const updateClaim = useCallback(
    async (uuid: string, claimData: ClaimsData) => {
      try {
        const updatedClaim = await claimActions.updateData(
          token,
          uuid,
          claimData
        );
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim.uuid === uuid ? updatedClaim : claim
          )
        );
      } catch (err) {
        console.error("Error updating claim:", err);
        setError("Failed to update claim");
      }
    },
    [token]
  );

  const deleteClaim = useCallback(
    async (uuid: string) => {
      console.log("Attempting to delete claim with uuid:", uuid);
      try {
        await claimActions.deleteData(token, uuid);
        console.log("Claim deleted successfully");

        // Update the local state
        setClaims((prevClaims) =>
          prevClaims.map((claim) =>
            claim.uuid === uuid ? { ...claim, active: false } : claim
          )
        );

        // Fetch the updated list of claims
        await fetchClaims();
      } catch (err) {
        console.error("Error deleting claim:", err);
        setError("Failed to delete claim");
      }
    },
    [token, fetchClaims]
  );

  const restoreClaim = useCallback(
    async (uuid: string) => {
      console.log("Attempting to restore claim with uuid:", uuid);
      try {
        await claimActions.restoreData(token, uuid);
        console.log("Claim restored successfully");

        // Fetch the updated list of claims
        await fetchClaims();
      } catch (err) {
        console.error("Error restoring claim:", err);
        setError("Failed to restore claim");
      }
    },
    [token, fetchClaims]
  );

  const validateAlliance = useCallback(
    async (
      allianceCompanyId: number | string,
      insuranceCompanyId: number | string
    ) => {
      try {
        const response = await claimActions.validateAllianceRelationship(
          token,
          allianceCompanyId,
          insuranceCompanyId
        );
        return response;
      } catch (err) {
        console.error("Error validating alliance relationship:", err);
        throw new Error("Failed to validate alliance relationship");
      }
    },
    [token]
  );

  return {
    claims,
    loading,
    error,
    createClaim,
    updateClaim,
    deleteClaim,
    restoreClaim,
    validateAlliance,
  };
};
