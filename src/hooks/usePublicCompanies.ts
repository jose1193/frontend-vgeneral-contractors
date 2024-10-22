import { useState, useEffect, useCallback } from "react";
import { PublicCompanyData } from "../../app/types/public-company";
import * as publicCompanyActions from "../../app/lib/actions/publicCompanyActions";

export const usePublicCompanies = (token: string) => {
  const [publicCompanies, setPublicCompanies] = useState<PublicCompanyData[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await publicCompanyActions.getDataFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setPublicCompanies(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setPublicCompanies([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching public companies:", err);
      setPublicCompanies([]);
      setError("Failed to fetch public companies");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPublicCompanies();
  }, [fetchPublicCompanies]);

  const createPublicCompany = useCallback(
    async (publicCompanyData: PublicCompanyData) => {
      try {
        const newPublicCompany = await publicCompanyActions.createData(
          token,
          publicCompanyData
        );
        setPublicCompanies((prevCompanies) => [
          ...prevCompanies,
          newPublicCompany,
        ]);
        return newPublicCompany;
      } catch (err) {
        setError("Failed to create public company");
        throw err;
      }
    },
    [token]
  );

  const updatePublicCompany = useCallback(
    async (uuid: string, publicCompanyData: PublicCompanyData) => {
      try {
        const updatedPublicCompany = await publicCompanyActions.updateData(
          token,
          uuid,
          publicCompanyData
        );
        setPublicCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.uuid === uuid ? updatedPublicCompany : company
          )
        );
      } catch (err) {
        setError("Failed to update public company");
        throw err;
      }
    },
    [token]
  );

  const deletePublicCompany = useCallback(
    async (uuid: string) => {
      try {
        await publicCompanyActions.deleteData(token, uuid);
        setPublicCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting public company:", err);
        setError("Failed to delete public company");
        throw err;
      }
    },
    [token]
  );

  return {
    publicCompanies,
    loading,
    error,
    createPublicCompany,
    updatePublicCompany,
    deletePublicCompany,
    refreshPublicCompanies: fetchPublicCompanies,
  };
};
