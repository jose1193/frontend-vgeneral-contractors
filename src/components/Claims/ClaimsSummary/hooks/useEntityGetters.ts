// components/Claims/ClaimsSummary/hooks/useEntityGetters.ts
import { useCallback } from "react";
import {
  StoreState,
  EntityGetters,
} from "../../../../../app/types/claimsTypes";
import { getEntityName, formatArrayToString } from "../utils/entityUtils";
import { usePropertyContext } from "../../../../../app/contexts/PropertyContext";

export const useEntityGetters = (
  data: any,
  stores: StoreState
): EntityGetters => {
  const { properties } = usePropertyContext();

  const getInsuranceCompanyName = useCallback(
    () =>
      getEntityName(
        data.insurance_company_id,
        stores.insuranceCompanies,
        "insurance_company_name"
      ),
    [data.insurance_company_id, stores.insuranceCompanies]
  );

  const getMortgageCompanyName = useCallback(
    () =>
      getEntityName(
        data.mortgage_company_id,
        stores.mortgageCompanies,
        "mortgage_company_name"
      ),
    [data.mortgage_company_id, stores.mortgageCompanies]
  );

  const getPublicCompanyName = useCallback(
    () =>
      getEntityName(
        data.public_company_id,
        stores.publicCompanies,
        "public_company_name"
      ),
    [data.public_company_id, stores.publicCompanies]
  );

  const getAllianceCompanyName = useCallback(
    () =>
      getEntityName(
        data.alliance_company_id,
        stores.allianceCompanies,
        "alliance_company_name"
      ),
    [data.alliance_company_id, stores.allianceCompanies]
  );

  const getTypeDamage = useCallback(
    () =>
      getEntityName(
        data.type_damage_id,
        stores.typeDamages,
        "type_damage_name"
      ),
    [data.type_damage_id, stores.typeDamages]
  );

  const getPublicAdjusterName = useCallback(() => {
    if (data.public_adjuster_id && stores.users.length > 0) {
      const adjuster = stores.users.find(
        (adjuster) => adjuster.id === data.public_adjuster_id
      );
      return adjuster
        ? `${adjuster.name} ${adjuster.last_name || ""}`.trim()
        : "N/A";
    }
    return "N/A";
  }, [data.public_adjuster_id, stores.users]);

  const getCauseOfLossNames = useCallback(
    () =>
      formatArrayToString(
        data.cause_of_loss_id,
        stores.causesOfLoss,
        "cause_loss_name"
      ),
    [data.cause_of_loss_id, stores.causesOfLoss]
  );

  const getServiceNames = useCallback(
    () =>
      formatArrayToString(
        data.service_request_id,
        stores.services,
        "requested_service"
      ),
    [data.service_request_id, stores.services]
  );

  const getPropertyInfo = useCallback(() => {
    const propertyId = data.property_id;
    if (!propertyId) return { address: "N/A", customers: [] };

    const selectedProperty = properties.find((p) => p.id === propertyId);
    if (!selectedProperty) return { address: "N/A", customers: [] };

    const address = [
      selectedProperty.property_address,
      selectedProperty.property_city,
      selectedProperty.property_state,
      selectedProperty.property_postal_code,
      selectedProperty.property_country,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      address,
      customers: selectedProperty.customers || [],
    };
  }, [data.property_id, properties]);

  return {
    getInsuranceCompanyName,
    getMortgageCompanyName,
    getPublicCompanyName,
    getPublicAdjusterName,
    getServiceNames,
    getTypeDamage,
    getCauseOfLossNames,
    getAllianceCompanyName,
    getPropertyInfo,
  };
};
