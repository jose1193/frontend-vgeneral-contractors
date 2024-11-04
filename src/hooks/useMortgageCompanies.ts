import { useState, useEffect, useCallback } from "react";
import { MortgageCompanyData } from "../../app/types/mortgage-company";
import * as mortgageCompanyActions from "../../app/lib/actions/mortgageCompanyActions";

export const useMortgageCompanies = (token: string) => {
  const [mortgageCompanies, setMortgageCompanies] = useState<
    MortgageCompanyData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMortgageCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await mortgageCompanyActions.getDataFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setMortgageCompanies(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setMortgageCompanies([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching mortgage companies:", err);
      setMortgageCompanies([]);
      setError("Failed to fetch mortgage companies");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMortgageCompanies();
  }, [fetchMortgageCompanies]);

  const createMortgageCompany = useCallback(
    async (mortgageCompanyData: MortgageCompanyData) => {
      try {
        const newMortgageCompany = await mortgageCompanyActions.createData(
          token,
          mortgageCompanyData
        );
        setMortgageCompanies((prevCompanies) => [
          ...prevCompanies,
          newMortgageCompany,
        ]);
        return newMortgageCompany;
      } catch (err) {
        setError("Failed to create mortgage company");
        throw err;
      }
    },
    [token]
  );

  const updateMortgageCompany = useCallback(
    async (uuid: string, mortgageCompanyData: MortgageCompanyData) => {
      try {
        const updatedMortgageCompany = await mortgageCompanyActions.updateData(
          token,
          uuid,
          mortgageCompanyData
        );
        setMortgageCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.uuid === uuid ? updatedMortgageCompany : company
          )
        );
      } catch (err) {
        setError("Failed to update mortgage company");
        throw err;
      }
    },
    [token]
  );

  const deleteMortgageCompany = useCallback(
    async (uuid: string) => {
      try {
        await mortgageCompanyActions.deleteData(token, uuid);
        setMortgageCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting mortgage company:", err);
        setError("Failed to delete mortgage company");
        throw err;
      }
    },
    [token]
  );

  return {
    mortgageCompanies,
    loading,
    error,
    createMortgageCompany,
    updateMortgageCompany,
    deleteMortgageCompany,
    refreshMortgageCompanies: fetchMortgageCompanies,
  };
};
