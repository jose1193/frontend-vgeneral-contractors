import { useState, useEffect } from "react";
import { ClaimsData } from "../../app/types/claims";
import { getData } from "../../app/lib/actions/claimsActions";
import { useClaimAgreements } from "./useClaimAgreements";

export const useClaimProfile = (uuid: string, token: string) => {
  const [claim, setClaim] = useState<ClaimsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    claimAgreements,
    loading: agreementsLoading,
    error: agreementsError,
    createClaimAgreement,
    updateClaimAgreement,
    deleteClaimAgreement,
  } = useClaimAgreements(token);

  useEffect(() => {
    const fetchClaim = async () => {
      try {
        if (token && uuid) {
          const data = await getData(token, uuid);
          console.log("Fetched claim response:", data);
          setClaim(data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch claim");
        setLoading(false);
      }
    };

    fetchClaim();
  }, [uuid, token]);

  return {
    claim,
    loading: loading || agreementsLoading,
    error: error || agreementsError,
    createClaimAgreement,
    updateClaimAgreement,
    deleteClaimAgreement,
    claimAgreements,
  };
};
