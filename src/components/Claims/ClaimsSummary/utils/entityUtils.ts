// utils/entityUtils.ts
import { ServiceRequestData } from "../../../../../app/types/service-request";
import { CauseOfLossData } from "../../../../../app/types/cause-of-loss";

// Hacemos que id sea opcional
export interface EntityWithId {
  id?: number;
  [key: string]: any;
}

export const getEntityName = <T extends EntityWithId>(
  id: number | null | undefined,
  entities: T[],
  nameKey: keyof T
): string => {
  if (id === null || id === undefined || entities.length === 0) return "N/A";
  const entity = entities.find((e) => e.id === id);
  return entity ? String(entity[nameKey]) : "N/A";
};

export const capitalize = (str: string): string => {
  return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
};

// Actualizamos formatArrayToString para manejar IDs opcionales
export const formatArrayToString = <T extends EntityWithId>(
  ids: (number | undefined)[] | null | undefined,
  entities: T[],
  nameKey: keyof T
): string => {
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return "N/A";
  }

  return (
    ids
      .map((id) => {
        if (id === undefined) return "";
        const entity = entities.find((e) => e.id === id);
        return entity ? String(entity[nameKey]) : "";
      })
      .filter(Boolean)
      .join(", ") || "N/A"
  );
};
