// src/hooks/useClaims.ts

import { useState, useEffect } from "react";
import { ClaimsData } from "../../app/types/claims";
import * as claimActions from "../../app/lib/actions/claimsActions"; // Cambiamos de typeDamageActions a claimActions

export const useClaims = (token: string) => {
  const [claims, setClaims] = useState<ClaimsData[]>([]); // Cambiado typeDamages a claims
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        setLoading(true);
        const response = await claimActions.getDataFetch(token); // Cambiamos de getTypeDamages a getClaims
        console.log("Fetched claims response:", response);

        if (response.success && Array.isArray(response.data)) {
          setClaims(response.data); // Cambiado de setTypeDamages a setClaims
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setClaims([]); // Cambiado de setTypeDamages a setClaims
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching claims:", err);
        setClaims([]); // Cambiado de setTypeDamages a setClaims
        setError("Failed to fetch claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, [token]);

  const createClaim = async (
    claimData: ClaimsData
  ): Promise<string | undefined> => {
    try {
      const newClaim = await claimActions.createData(token, claimData);
      setClaims([...claims, newClaim]);
      return newClaim.uuid; // Assuming the API returns the UUID of the created claim
    } catch (err) {
      console.error("Failed to create claim:", err);
      throw err;
    }
  };

  const updateClaim = async (uuid: string, claimData: ClaimsData) => {
    try {
      const updatedClaim = await claimActions.updateData(
        token,
        uuid,
        claimData
      ); // Cambiado a updateClaim
      setClaims(
        claims.map((claim) => (claim.uuid === uuid ? updatedClaim : claim)) // Cambiado de typeDamages a claims
      );
    } catch (err) {
      setError("Failed to update claim"); // Cambiado el mensaje
    }
  };

  const deleteClaim = async (uuid: string) => {
    try {
      const deletedClaim = await claimActions.deleteData(token, uuid);
      setClaims(claims.filter((claim) => (claim.uuid ? deletedClaim : claim)));
    } catch (err) {
      setError("Failed to delete user");
    }
  };
  const restoreClaim = async (uuid: string) => {
    try {
      const restoredClaim = await claimActions.restoreData(token, uuid);
      setClaims(
        claims.map((claim) => (claim.uuid === uuid ? restoredClaim : claim))
      );
      // O si prefieres recargar toda la lista de usuarios:
      // await fetchClaims();
    } catch (err) {
      setError("Failed to restore claim");
    }
  };
  return {
    claims, // Cambiado de typeDamages a claims
    loading,
    error,
    createClaim,
    updateClaim,
    deleteClaim,
    restoreClaim,
  };
};
