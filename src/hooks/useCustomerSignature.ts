import { useState, useEffect, useCallback } from "react";
import { CustomerSignatureData } from "../../app/types/customer-signature";
import * as customerSignatureActions from "../../app/lib/actions/customerSignatureActions";

export const useCustomerSignature = (token: string) => {
  const [customerSignatures, setCustomerSignatures] = useState<
    CustomerSignatureData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomerSignatures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customerSignatureActions.getDataFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setCustomerSignatures(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setCustomerSignatures([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching customer signatures:", err);
      setCustomerSignatures([]);
      setError("Failed to fetch customer signatures");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCustomerSignatures();
  }, [fetchCustomerSignatures]);

  const createCustomerSignature = useCallback(
    async (customerSignatureData: CustomerSignatureData) => {
      try {
        const newCustomerSignature = await customerSignatureActions.createData(
          token,
          customerSignatureData
        );
        setCustomerSignatures((prevSignatures) => [
          ...prevSignatures,
          newCustomerSignature,
        ]);
        return newCustomerSignature;
      } catch (err) {
        setError("Failed to create customer signature");
        throw err;
      }
    },
    [token]
  );

  const updateCustomerSignature = useCallback(
    async (uuid: string, customerSignatureData: CustomerSignatureData) => {
      try {
        const updatedCustomerSignature =
          await customerSignatureActions.updateData(
            token,
            uuid,
            customerSignatureData
          );
        setCustomerSignatures((prevSignatures) =>
          prevSignatures.map((signature) =>
            signature.uuid === uuid ? updatedCustomerSignature : signature
          )
        );
      } catch (err) {
        setError("Failed to update customer signature");
        throw err;
      }
    },
    [token]
  );

  const deleteCustomerSignature = useCallback(
    async (uuid: string) => {
      try {
        await customerSignatureActions.deleteData(token, uuid);
        setCustomerSignatures((prevSignatures) =>
          prevSignatures.filter((signature) => signature.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting customer signature:", err);
        setError("Failed to delete customer signature");
        throw err;
      }
    },
    [token]
  );

  return {
    customerSignatures,
    loading,
    error,
    createCustomerSignature,
    updateCustomerSignature,
    deleteCustomerSignature,
    refreshCustomerSignatures: fetchCustomerSignatures,
  };
};
