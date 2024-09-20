// src/hooks/useCustomers.ts

import { useState, useEffect } from "react";
import { CustomerData } from "../../app/types/customer";
import * as customerActions from "../../app/lib/actions/customersActions";

export const useCustomers = (token: string) => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const response = await customerActions.getDataFetch(token);
        console.log("Fetched customers response:", response);

        if (response.success && Array.isArray(response.data)) {
          setCustomers(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
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
    };

    fetchCustomers();
  }, [token]);

  const createCustomer = async (customerData: Omit<CustomerData, "id">) => {
    try {
      const newCustomer = await customerActions.createData(token, customerData);
      setCustomers([...customers, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError("Failed to create customer");
      throw err;
    }
  };

  const updateCustomer = async (uuid: string, customerData: CustomerData) => {
    try {
      const updatedCustomer = await customerActions.updateData(
        token,
        uuid,
        customerData
      );
      setCustomers(
        customers.map((customer) =>
          customer.uuid === uuid ? updatedCustomer : customer
        )
      );
    } catch (err) {
      setError("Failed to update customer");
    }
  };

  const deleteCustomer = async (uuid: string) => {
    console.log("Attempting to delete customer with uuid:", uuid);
    try {
      console.log("Token:", token);
      console.log("UUID:", uuid);
      await customerActions.deleteData(token, uuid);
      console.log("Customer deleted successfully");
      setCustomers(customers.filter((customer) => customer.uuid !== uuid));
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Failed to delete customer");
    }
  };

  return {
    customers,
    loading,
    error,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
