import { useState, useEffect, useCallback } from "react";
import { AllianceCompanyData } from "../../app/types/alliance-company";
import * as allianceCompanyActions from "../../app/lib/actions/allianceCompanyActions";

export const useAllianceCompanies = (token: string) => {
  const [allianceCompanies, setAllianceCompanies] = useState<
    AllianceCompanyData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllianceCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await allianceCompanyActions.getDataFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setAllianceCompanies(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setAllianceCompanies([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching alliance companies:", err);
      setAllianceCompanies([]);
      setError("Failed to fetch alliance companies");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchAllianceCompanies();
  }, [fetchAllianceCompanies]);

  const createAllianceCompany = useCallback(
    async (allianceCompanyData: AllianceCompanyData) => {
      try {
        const newAllianceCompany = await allianceCompanyActions.createData(
          token,
          allianceCompanyData
        );
        setAllianceCompanies((prevCompanies) => [
          ...prevCompanies,
          newAllianceCompany,
        ]);
        return newAllianceCompany;
      } catch (err) {
        setError("Failed to create alliance company");
        throw err;
      }
    },
    [token]
  );

  const updateAllianceCompany = useCallback(
    async (uuid: string, allianceCompanyData: AllianceCompanyData) => {
      try {
        const updatedAllianceCompany = await allianceCompanyActions.updateData(
          token,
          uuid,
          allianceCompanyData
        );
        setAllianceCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.uuid === uuid ? updatedAllianceCompany : company
          )
        );
      } catch (err) {
        setError("Failed to update alliance company");
        throw err;
      }
    },
    [token]
  );

  const deleteAllianceCompany = useCallback(
    async (uuid: string) => {
      try {
        await allianceCompanyActions.deleteData(token, uuid);
        setAllianceCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting alliance company:", err);
        setError("Failed to delete alliance company");
        throw err;
      }
    },
    [token]
  );

  return {
    allianceCompanies,
    loading,
    error,
    createAllianceCompany,
    updateAllianceCompany,
    deleteAllianceCompany,
    refreshAllianceCompanies: fetchAllianceCompanies,
  };
};
