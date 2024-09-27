// src/hooks/useCompanySignature.ts
import { useState, useEffect, useCallback } from "react";
import { CompanySignatureData } from "../../app/types/company-signature";
import * as companySignatureActions from "../../app/lib/actions/companySignatureActions";

export const useCompanySignatures = (token: string) => {
  const [companySignatures, setCompanySignatures] = useState<
    CompanySignatureData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanySignatures = useCallback(async () => {
    try {
      setLoading(true);
      const response = await companySignatureActions.getDataFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setCompanySignatures(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setCompanySignatures([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching company signatures:", err);
      setCompanySignatures([]);
      setError("Failed to fetch company signatures");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCompanySignatures();
  }, [fetchCompanySignatures]);

  const createCompanySignature = useCallback(
    async (companySignatureData: CompanySignatureData) => {
      try {
        const newCompanySignature = await companySignatureActions.createData(
          token,
          companySignatureData
        );
        setCompanySignatures((prevSignatures) => [
          ...prevSignatures,
          newCompanySignature,
        ]);
        return newCompanySignature;
      } catch (err) {
        setError("Failed to create company signature");
        throw err;
      }
    },
    [token]
  );

  const updateCompanySignature = useCallback(
    async (uuid: string, companySignatureData: CompanySignatureData) => {
      try {
        const updatedCompanySignature =
          await companySignatureActions.updateData(
            token,
            uuid,
            companySignatureData
          );
        setCompanySignatures((prevSignatures) =>
          prevSignatures.map((signature) =>
            signature.uuid === uuid ? updatedCompanySignature : signature
          )
        );
      } catch (err) {
        setError("Failed to update company signature");
        throw err;
      }
    },
    [token]
  );

  const deleteCompanySignature = useCallback(
    async (uuid: string) => {
      try {
        await companySignatureActions.deleteData(token, uuid);
        setCompanySignatures((prevSignatures) =>
          prevSignatures.filter((signature) => signature.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting company signature:", err);
        setError("Failed to delete company signature");
        throw err;
      }
    },
    [token]
  );

  return {
    companySignatures,
    loading,
    error,
    createCompanySignature,
    updateCompanySignature,
    deleteCompanySignature,
    refreshCompanySignatures: fetchCompanySignatures,
  };
};
