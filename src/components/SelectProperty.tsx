import React, { useEffect, useState, useCallback } from "react";
import { Controller, Control, useFormContext } from "react-hook-form";
import {
  FormControl,
  Autocomplete,
  TextField,
  CircularProgress,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";
import { PropertyData } from "../../app/types/property";
import { usePropertyContext } from "../../app/contexts/PropertyContext";
import { getData } from "../../app/lib/actions/propertiesActions";
import { useSession } from "next-auth/react";

interface SelectPropertyProps {
  control: Control<any>;
  onChange?: (
    value: PropertyData | null,
    associatedCustomerIds: number[]
  ) => void;
  value: number | undefined;
  selectedCustomerId: number | undefined;
}

const SelectProperty: React.FC<SelectPropertyProps> = ({
  control,
  onChange,
  selectedCustomerId,
}) => {
  const {
    properties,
    loading,
    error,
    updateProperty,
    addNewPropertyWithCustomers,
  } = usePropertyContext();
  const { watch, setValue } = useFormContext();
  const { data: session } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const selectedPropertyId = watch("property_id");

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const filteredProperties = selectedCustomerId
    ? properties.filter(
        (property) =>
          property.customers?.some(
            (customer) => customer.id === selectedCustomerId
          ) || property.customer_id === selectedCustomerId
      )
    : [];

  const formatPropertyLabel = (option: PropertyData): string => {
    const propertyAddress =
      option.property_address?.toUpperCase() || "UNKNOWN ADDRESS";
    const propertyCity = option.property_city?.toUpperCase() || "UNKNOWN CITY";
    const propertyState =
      option.property_state?.toUpperCase() || "UNKNOWN STATE";
    const propertyPostalCode =
      option.property_postal_code?.toUpperCase() || "UNKNOWN POSTAL CODE";
    const propertyCountry =
      option.property_country?.toUpperCase() || "UNKNOWN COUNTRY";

    return `${propertyAddress}, ${propertyCity}, ${propertyState} ${propertyPostalCode}, ${propertyCountry}`;
  };

  useEffect(() => {
    const refreshPropertyData = async () => {
      if (selectedPropertyId && session?.accessToken) {
        setRefreshing(true);
        try {
          const selectedProperty = properties.find(
            (p) => p.id === selectedPropertyId
          );
          if (selectedProperty?.uuid) {
            const updatedProperty = await getData(
              session.accessToken,
              selectedProperty.uuid
            );
            updateProperty(updatedProperty);
          }
        } catch (error) {
          console.error("Error refreshing property data:", error);
        } finally {
          setRefreshing(false);
        }
      }
    };

    refreshPropertyData();
  }, [selectedPropertyId, session?.accessToken, properties, updateProperty]);

  const handleNewProperty = useCallback(
    (newProperty: PropertyData, associatedCustomers: any[]) => {
      addNewPropertyWithCustomers(newProperty, associatedCustomers);
      setValue("property_id", newProperty.id);
      if (onChange) {
        const associatedCustomerIds = associatedCustomers
          .map((customer) => customer.id)
          .filter((id): id is number => id !== undefined);
        onChange(newProperty, associatedCustomerIds);
      }
    },
    [addNewPropertyWithCustomers, setValue, onChange]
  );

  // Expose handleNewProperty to the global scope
  useEffect(() => {
    (window as any).handleNewProperty = handleNewProperty;
    return () => {
      delete (window as any).handleNewProperty;
    };
  }, [handleNewProperty]);

  return (
    <Controller
      name="property_id"
      control={control}
      render={({
        field: { onChange: fieldOnChange, value, ...rest },
        fieldState: { error: fieldError },
      }) => (
        <FormControl fullWidth>
          <Autocomplete<PropertyData, false, false, false>
            {...rest}
            options={filteredProperties}
            getOptionLabel={(option: PropertyData | string): string => {
              if (typeof option === "string") {
                return option.toUpperCase();
              }
              return formatPropertyLabel(option);
            }}
            renderOption={(props, option: PropertyData) => (
              <li {...props}>{formatPropertyLabel(option)}</li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Property"
                error={!!fieldError}
                helperText={fieldError?.message}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading || refreshing ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            loading={loading || refreshing}
            onChange={(_, newValue: PropertyData | null) => {
              fieldOnChange(newValue ? newValue.id : null);
              if (onChange) {
                const associatedCustomerIds =
                  newValue?.customers
                    ?.map((customer) => customer.id)
                    .filter((id): id is number => id !== undefined) || [];
                onChange(newValue, associatedCustomerIds);
              }
            }}
            value={
              filteredProperties.find((property) => property.id === value) ||
              null
            }
            isOptionEqualToValue={(
              option: PropertyData,
              value: PropertyData | string
            ) => option.id === (typeof value === "string" ? value : value.id)}
          />
          {error && <FormHelperText error>{error}</FormHelperText>}

          {value && (
            <Box mt={2}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold" }}
                gutterBottom
              >
                Customers associated with this property:
              </Typography>
              {filteredProperties
                .find((property) => property.id === value)
                ?.customers?.map((customer, index) => (
                  <Typography key={customer.id} variant="body2">
                    <span>{index + 1}. </span>
                    <span style={{ color: "#662401", fontWeight: "bold" }}>
                      {customer.name} {customer.last_name}
                    </span>
                    {customer.email && (
                      <span
                        style={{
                          fontWeight: "bold",
                          color: "black",
                          marginLeft: 5,
                        }}
                      >
                        {" "}
                        ({customer.email})
                      </span>
                    )}
                    {customer.role && (
                      <span style={{ fontWeight: "bold", color: "black" }}>
                        {" "}
                        - ({capitalize(customer.role)})
                      </span>
                    )}
                  </Typography>
                )) || (
                <Typography variant="body2">
                  No customers associated with this property.
                </Typography>
              )}
            </Box>
          )}
        </FormControl>
      )}
    />
  );
};

export default SelectProperty;
