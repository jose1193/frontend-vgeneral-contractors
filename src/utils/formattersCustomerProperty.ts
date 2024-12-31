import type { PropertyData } from '../../app/types/property';
import type { CustomerData } from '../../app/types/customer';

export const formatPropertyAddress = (property: PropertyData | null | string | undefined): string => {
  if (!property) return 'N/A';

  if (typeof property === 'string') {
    return property;
  }

  const {
    property_address,
    property_city,
    property_state,
    property_postal_code,
    property_country,
  } = property;

  return [
    property_address,
    property_city,
    property_state,
    property_postal_code,
    property_country,
  ]
    .filter(Boolean)
    .join(', ');
};

export const renderCustomers = (customers?: CustomerData[]): string => {
  if (!customers || customers.length === 0) return 'N/A';
  return customers
    .map(customer => `${customer.name} ${customer.last_name}`)
    .filter(Boolean)
    .join(', ') || 'N/A';
};