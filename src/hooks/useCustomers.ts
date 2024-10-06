// src/hooks/useCustomers.ts

import { useState, useEffect, useCallback } from "react";
import { CustomerData } from "../../app/types/customer";
import * as customerActions from "../../app/lib/actions/customersActions";

export const useCustomers = (token: string) => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customerActions.getDataFetch(token);
      console.log("Fetched customers response:", response);

      if (response.success && Array.isArray(response.data)) {
        setCustomers(response.data);
        setError(null);
      } else {
        console.error("Fetched data is not in the expected format:", response);
        setCustomers([]);
        setError("Received invalid data format");
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setCustomers([]);
      setError("Failed to fetch customers");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const createCustomer = useCallback(
    async (customerData: Omit<CustomerData, "id">) => {
      try {
        const newCustomer = await customerActions.createData(
          token,
          customerData
        );
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
        return newCustomer;
      } catch (err) {
        setError("Failed to create customer");
        throw err;
      }
    },
    [token]
  );

  const updateCustomer = useCallback(
    async (uuid: string, customerData: CustomerData) => {
      try {
        const updatedCustomer = await customerActions.updateData(
          token,
          uuid,
          customerData
        );
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.uuid === uuid ? updatedCustomer : customer
          )
        );
      } catch (err) {
        setError("Failed to update customer");
        throw err;
      }
    },
    [token]
  );

  const deleteCustomer = useCallback(
    async (uuid: string) => {
      console.log("Attempting to delete customer with uuid:", uuid);
      try {
        await customerActions.deleteData(token, uuid);
        console.log("Customer deleted successfully");

        // Update the local state
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.uuid === uuid ? { ...customer, active: false } : customer
          )
        );

        // Fetch the updated list of customers
        await fetchCustomers();
      } catch (err) {
        console.error("Error deleting customer:", err);
        setError("Failed to delete customer");
      }
    },
    [token, fetchCustomers]
  );

  const restoreCustomer = useCallback(
    async (uuid: string) => {
      try {
        const restoredCustomer = await customerActions.restoreData(token, uuid);
        setCustomers((prevCustomers) =>
          prevCustomers.map((customer) =>
            customer.uuid === uuid ? restoredCustomer : customer
          )
        );
      } catch (err) {
        setError("Failed to restore customer");
        throw err;
      }
    },
    [token]
  );

  const checkEmailAvailability = useCallback(
    async (email: string, uuid?: string) => {
      try {
        const response = await customerActions.checkEmailCustomerAvailable(
          token,
          email,
          uuid
        );
        return response;
      } catch (err) {
        console.error("Error checking email availability:", err);
        throw err;
      }
    },
    [token]
  );

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    restoreCustomer,
    checkEmailAvailability,
  };
};
