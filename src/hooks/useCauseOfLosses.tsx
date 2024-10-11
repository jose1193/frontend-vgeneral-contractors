// src/hooks/useCauseOfLosses.ts

import { useState, useEffect, useCallback } from "react";
import { CauseOfLossData } from "../../app/types/cause-of-loss";
import * as causeOfLossActions from "../../app/lib/actions/causeOfLossActions";
import { debounce } from "lodash";

export const useCauseOfLosses = (token: string) => {
  const [causeOfLosses, setCauseOfLosses] = useState<CauseOfLossData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCauseOfLosses = async () => {
      try {
        setLoading(true);
        const response = await causeOfLossActions.getCauseOfLosses(token);
        console.log("Fetched cause of losses response:", response);

        if (response.success && Array.isArray(response.data)) {
          setCauseOfLosses(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setCauseOfLosses([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching cause of losses:", err);
        setCauseOfLosses([]);
        setError("Failed to fetch cause of losses");
      } finally {
        setLoading(false);
      }
    };

    fetchCauseOfLosses();
  }, [token]);

  const createCauseOfLoss = async (causeData: CauseOfLossData) => {
    try {
      const newCauseOfLoss = await causeOfLossActions.createCauseOfLoss(
        token,
        causeData
      );
      setCauseOfLosses([...causeOfLosses, newCauseOfLoss]);
    } catch (err) {
      setError("Failed to create cause of loss");
    }
  };

  const updateCauseOfLoss = async (
    uuid: string,
    causeData: CauseOfLossData
  ) => {
    try {
      const updatedCauseOfLoss = await causeOfLossActions.updateCauseOfLoss(
        token,
        uuid,
        causeData
      );
      setCauseOfLosses(
        causeOfLosses.map((causeOfLoss) =>
          causeOfLoss.uuid === uuid ? updatedCauseOfLoss : causeOfLoss
        )
      );
    } catch (err) {
      setError("Failed to update cause of loss");
    }
  };

  const deleteCauseOfLoss = async (uuid: string) => {
    console.log("Attempting to delete cause of loss with uuid:", uuid);
    try {
      console.log("Token:", token);
      console.log("UUID:", uuid);
      await causeOfLossActions.deleteCauseOfLoss(token, uuid);
      console.log("Cause of loss deleted successfully");
      setCauseOfLosses(
        causeOfLosses.filter((causeOfLoss) => causeOfLoss.uuid !== uuid)
      );
    } catch (err) {
      console.error("Error deleting cause of loss:", err);
      setError("Failed to delete cause of loss");
    }
  };

  return {
    causeOfLosses,
    loading,
    error,
    createCauseOfLoss,
    updateCauseOfLoss,
    deleteCauseOfLoss,
  };
};
