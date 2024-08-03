// src/hooks/useTypeDamages.ts

import { useState, useEffect, useCallback } from "react";
import { TypeDamageData } from "../../app/types/type-damage";
import * as typeDamageActions from "../../app/lib/actions/typeDamageActions";
import { debounce } from "lodash";

export const useTypeDamages = (token: string) => {
  const [typeDamages, setTypeDamages] = useState<TypeDamageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypeDamages = async () => {
      try {
        setLoading(true);
        const response = await typeDamageActions.getTypeDamages(token);
        console.log("Fetched type damages response:", response);

        if (response.success && Array.isArray(response.data)) {
          setTypeDamages(response.data);
          setError(null);
        } else {
          console.error(
            "Fetched data is not in the expected format:",
            response
          );
          setTypeDamages([]);
          setError("Received invalid data format");
        }
      } catch (err) {
        console.error("Error fetching type damages:", err);
        setTypeDamages([]);
        setError("Failed to fetch type damages");
      } finally {
        setLoading(false);
      }
    };

    fetchTypeDamages();
  }, [token]);

  const createTypeDamage = async (typeData: TypeDamageData) => {
    try {
      const newTypeDamage = await typeDamageActions.createTypeDamage(
        token,
        typeData
      );
      setTypeDamages([...typeDamages, newTypeDamage]);
    } catch (err) {
      setError("Failed to create type damage");
    }
  };

  const updateTypeDamage = async (uuid: string, typeData: TypeDamageData) => {
    try {
      const updatedTypeDamage = await typeDamageActions.updateTypeDamage(
        token,
        uuid,
        typeData
      );
      setTypeDamages(
        typeDamages.map((typeDamage) =>
          typeDamage.uuid === uuid ? updatedTypeDamage : typeDamage
        )
      );
    } catch (err) {
      setError("Failed to update type damage");
    }
  };

  const deleteTypeDamage = async (uuid: string) => {
    console.log("Attempting to delete type damage with uuid:", uuid);
    try {
      console.log("Token:", token);
      console.log("UUID:", uuid);
      await typeDamageActions.deleteTypeDamage(token, uuid);
      console.log("Type damage deleted successfully");
      setTypeDamages(
        typeDamages.filter((typeDamage) => typeDamage.uuid !== uuid)
      );
    } catch (err) {
      console.error("Error deleting type damage:", err);
      setError("Failed to delete type damage");
    }
  };

  return {
    typeDamages,
    loading,
    error,
    createTypeDamage,
    updateTypeDamage,
    deleteTypeDamage,
  };
};
