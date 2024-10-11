import { useState, useEffect, useCallback } from "react";
import { InsuranceCompanyData } from "../../app/types/insurance-company";
import * as insuranceCompanyActions from "../../app/lib/actions/insuranceCompanyActions";

export const useInsuranceCompanies = (token: string) => {
  const [insuranceCompanies, setInsuranceCompanies] = useState<
    InsuranceCompanyData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsuranceCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await insuranceCompanyActions.getDataFetch(token);
      if (response.success && Array.isArray(response.data)) {
        setInsuranceCompanies(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setInsuranceCompanies([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching insurance companies:", err);
      setInsuranceCompanies([]);
      setError("Failed to fetch insurance companies");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInsuranceCompanies();
  }, [fetchInsuranceCompanies]);

  const createInsuranceCompany = useCallback(
    async (insuranceCompanyData: InsuranceCompanyData) => {
      try {
        const newInsuranceCompany = await insuranceCompanyActions.createData(
          token,
          insuranceCompanyData
        );
        setInsuranceCompanies((prevCompanies) => [
          ...prevCompanies,
          newInsuranceCompany,
        ]);
        return newInsuranceCompany;
      } catch (err) {
        setError("Failed to create insurance company");
        throw err;
      }
    },
    [token]
  );

  const updateInsuranceCompany = useCallback(
    async (uuid: string, insuranceCompanyData: InsuranceCompanyData) => {
      try {
        const updatedInsuranceCompany =
          await insuranceCompanyActions.updateData(
            token,
            uuid,
            insuranceCompanyData
          );
        setInsuranceCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company.uuid === uuid ? updatedInsuranceCompany : company
          )
        );
      } catch (err) {
        setError("Failed to update insurance company");
        throw err;
      }
    },
    [token]
  );

  const deleteInsuranceCompany = useCallback(
    async (uuid: string) => {
      try {
        await insuranceCompanyActions.deleteData(token, uuid);
        setInsuranceCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company.uuid !== uuid)
        );
      } catch (err) {
        console.error("Error deleting insurance company:", err);
        setError("Failed to delete insurance company");
        throw err;
      }
    },
    [token]
  );

  return {
    insuranceCompanies,
    loading,
    error,
    createInsuranceCompany,
    updateInsuranceCompany,
    deleteInsuranceCompany,
    refreshInsuranceCompanies: fetchInsuranceCompanies,
  };
};
