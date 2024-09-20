// src/hooks/useProperties.ts
import { useState, useEffect } from "react";
import { PropertyData } from "../../app/types/property";
import * as propertyActions from "../../app/lib/actions/propertiesActions";

export const useProperties = (token: string) => {
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await propertyActions.getDataFetch(token);

        if (response.success && Array.isArray(response.data)) {
          setProperties(response.data);
          setError(null);
        } else {
          setProperties([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        setProperties([]);
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [token]);

  const createProperty = async (propertyData: Omit<PropertyData, "id">) => {
    try {
      const newProperty = await propertyActions.createData(token, propertyData);
      setProperties([...properties, newProperty]);
      return newProperty;
    } catch (err) {
      setError("Failed to create customer");
      throw err;
    }
  };

  const updateProperty = async (uuid: string, propertyData: PropertyData) => {
    try {
      const updatedProperty = await propertyActions.updateData(
        token,
        uuid,
        propertyData
      );
      setProperties(
        properties.map((property) =>
          property.uuid === uuid ? updatedProperty : property
        )
      );
    } catch (err) {
      setError("Failed to update property");
    }
  };

  const deleteProperty = async (uuid: string) => {
    try {
      await propertyActions.deleteData(token, uuid);
      setProperties(properties.filter((property) => property.uuid !== uuid));
    } catch (err) {
      setError("Failed to delete property");
    }
  };

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};
