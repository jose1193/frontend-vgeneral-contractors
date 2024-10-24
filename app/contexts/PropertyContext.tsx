"use client";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { checkPropertiesAvailable } from "../lib/actions/propertiesActions";
import { useSession } from "next-auth/react";
import { PropertyData } from "../../app/types/property";
import { CustomerData } from "../../app/types/customer";

type PropertyContextType = {
  properties: PropertyData[];
  setProperties: React.Dispatch<React.SetStateAction<PropertyData[]>>;
  addProperty: (property: PropertyData) => void;
  updateProperty: (updatedProperty: PropertyData) => void;
  addCustomerToProperty: (propertyId: number, customer: CustomerData) => void;
  addNewPropertyWithCustomers: (
    property: Omit<PropertyData, "customers">,
    customers: CustomerData[]
  ) => void;
  refreshProperties: () => Promise<void>;
  loading: boolean;
  error: string | null;
};

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

export const usePropertyContext = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error(
      "usePropertyContext must be used within a PropertyProvider"
    );
  }
  return context;
};

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  const refreshProperties = useCallback(async () => {
    try {
      setLoading(true);
      const token = session?.accessToken as string;
      const response = await checkPropertiesAvailable(token);
      if (response.success && Array.isArray(response.data)) {
        setProperties(response.data);
        setError(null);
      } else {
        setError("Received invalid data format");
      }
    } catch (error) {
      console.error("Error refreshing properties:", error);
      setError("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    refreshProperties();
  }, [refreshProperties]);

  const addProperty = useCallback((property: PropertyData) => {
    setProperties((prev) => [...prev, property]);
  }, []);

  const updateProperty = useCallback((updatedProperty: PropertyData) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === updatedProperty.id ? updatedProperty : prop
      )
    );
  }, []);

  const addCustomerToProperty = useCallback(
    (propertyId: number, customer: CustomerData) => {
      setProperties((prevProperties) =>
        prevProperties.map((property) =>
          property.id === propertyId
            ? {
                ...property,
                customers: [...(property.customers || []), customer],
              }
            : property
        )
      );
    },
    []
  );

  const addNewPropertyWithCustomers = useCallback(
    (property: Omit<PropertyData, "customers">, customers: CustomerData[]) => {
      setProperties((prev) => {
        const newProperty: PropertyData = {
          ...property,
          customers: customers,
        };
        return [...prev, newProperty];
      });
    },
    []
  );

  const contextValue = React.useMemo(
    () => ({
      properties,
      setProperties,
      addProperty,
      updateProperty,
      addCustomerToProperty,
      addNewPropertyWithCustomers,
      refreshProperties,
      loading,
      error,
    }),
    [
      properties,
      addProperty,
      updateProperty,
      addCustomerToProperty,
      addNewPropertyWithCustomers,
      refreshProperties,
      loading,
      error,
    ]
  );

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
};
