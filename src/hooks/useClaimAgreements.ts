import { useState, useEffect, useCallback } from "react";
import { ClaimAgreementData } from "../../app/types/claim-agreement";
import * as claimAgreementActions from "../../app/lib/actions/claimAgreementsActions";

export const useClaimAgreements = (token: string) => {
  const [claimAgreements, setClaimAgreements] = useState<ClaimAgreementData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaimAgreements = useCallback(async () => {
    try {
      const response = await claimAgreementActions.getClaimAgreements(token);
      console.log("Fetched claim agreements response:", response);

      if (response.success && Array.isArray(response.data)) {
        setClaimAgreements(response.data);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setError("Received invalid data format");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching claim agreements:", err);
      setError("Failed to fetch claim agreements");
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchClaimAgreements();
  }, [fetchClaimAgreements]);

  const createClaimAgreement = async (agreementData: ClaimAgreementData) => {
    try {
      const newClaimAgreement =
        await claimAgreementActions.createClaimAgreement(token, agreementData);
      setClaimAgreements([...claimAgreements, newClaimAgreement]);
    } catch (err) {
      setError("Failed to create claim agreement");
    }
  };

  const updateClaimAgreement = async (
    uuid: string,
    agreementData: ClaimAgreementData
  ) => {
    try {
      const updatedClaimAgreement =
        await claimAgreementActions.updateClaimAgreement(
          token,
          uuid,
          agreementData
        );
      setClaimAgreements(
        claimAgreements.map((agreement) =>
          agreement.uuid === uuid ? updatedClaimAgreement : agreement
        )
      );
    } catch (err) {
      setError("Failed to update claim agreement");
    }
  };

  const deleteClaimAgreement = useCallback(
    async (uuid: string) => {
      console.log("Attempting to delete claim agreement with uuid:", uuid);
      try {
        await claimAgreementActions.deleteClaimAgreement(token, uuid);
        console.log("Claim agreement deleted successfully");

        // Update the local state
        setClaimAgreements((prevAgreements) =>
          prevAgreements.map((agreement) =>
            agreement.uuid === uuid
              ? { ...agreement, active: false }
              : agreement
          )
        );

        // Fetch the updated list of claim agreements
        await fetchClaimAgreements();
      } catch (err) {
        console.error("Error deleting claim agreement:", err);
        setError("Failed to delete claim agreement");
      }
    },
    [token, fetchClaimAgreements]
  );

  return {
    claimAgreements,
    loading,
    error,
    createClaimAgreement,
    updateClaimAgreement,
    deleteClaimAgreement,
  };
};
