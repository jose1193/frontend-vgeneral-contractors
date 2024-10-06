import { useState, useEffect, useCallback } from "react";
import { SalesPersonSignatureData } from "../../app/types/salesperson-signature";
import * as salespersonSignatureActions from "../../app/lib/actions/salespersonSignatureActions";

export const useSalespersonSignatures = (token: string) => {
  const [salespersonSignatures, setSalespersonSignatures] = useState<
    SalesPersonSignatureData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalespersonSignatures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await salespersonSignatureActions.getDataFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setSalespersonSignatures(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setSalespersonSignatures([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching salesperson signatures:", err);
      setSalespersonSignatures([]);
      setError("Failed to fetch salesperson signatures");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSalespersonSignatures();
  }, [fetchSalespersonSignatures]);

  const createSalespersonSignature = useCallback(
    async (salespersonSignatureData: SalesPersonSignatureData) => {
      try {
        const newSalespersonSignature =
          await salespersonSignatureActions.createData(
            token,
            salespersonSignatureData
          );
        setSalespersonSignatures((prevSignatures) => [
          ...prevSignatures,
          newSalespersonSignature,
        ]);
        return newSalespersonSignature;
      } catch (err) {
        setError("Failed to create salesperson signature");
        throw err;
      }
    },
    [token]
  );

  const updateSalespersonSignature = useCallback(
    async (
      uuid: string,
      salespersonSignatureData: SalesPersonSignatureData
    ) => {
      try {
        const updatedSalespersonSignature =
          await salespersonSignatureActions.updateData(
            token,
            uuid,
            salespersonSignatureData
          );
        setSalespersonSignatures((prevSignatures) =>
          prevSignatures.map((signature) =>
            signature.uuid === uuid ? updatedSalespersonSignature : signature
          )
        );
      } catch (err) {
        setError("Failed to update salesperson signature");
        throw err;
      }
    },
    [token]
  );

  const deleteSalespersonSignature = useCallback(
    async (uuid: string) => {
      try {
        await salespersonSignatureActions.deleteData(token, uuid);
        setSalespersonSignatures((prevSignatures) =>
          prevSignatures.filter((signature) => signature.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting salesperson signature:", err);
        setError("Failed to delete salesperson signature");
        throw err;
      }
    },
    [token]
  );

  return {
    salespersonSignatures,
    loading,
    error,
    createSalespersonSignature,
    updateSalespersonSignature,
    deleteSalespersonSignature,
    refreshSalespersonSignatures: fetchSalespersonSignatures,
  };
};
