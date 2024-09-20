"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { checkCustomersAvailable } from "../lib/actions/customersActions";
import { useSession } from "next-auth/react";
import { CustomerData } from "../../app/types/customer";

type CustomerContextType = {
  customers: CustomerData[];
  addCustomer: (customer: CustomerData) => void;
  refreshCustomers: () => Promise<void>;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
  undefined
);

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error(
      "useCustomerContext must be used within a CustomerProvider"
    );
  }
  return context;
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const { data: session } = useSession();

  const refreshCustomers = useCallback(async () => {
    try {
      const token = session?.accessToken as string;
      const response = await checkCustomersAvailable(token);
      if (response.success && Array.isArray(response.data)) {
        setCustomers(response.data);
      }
    } catch (error) {
      console.error("Error refreshing customers:", error);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  const addCustomer = useCallback((customer: CustomerData) => {
    setCustomers((prev) => [...prev, customer]);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      customers,
      addCustomer,
      refreshCustomers,
    }),
    [customers, addCustomer, refreshCustomers]
  );

  return (
    <CustomerContext.Provider value={contextValue}>
      {children}
    </CustomerContext.Provider>
  );
};
