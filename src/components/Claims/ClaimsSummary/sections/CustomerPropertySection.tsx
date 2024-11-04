// components/sections/CustomerPropertySection.tsx
import React from "react";
import { Typography, Box, Grid } from "@mui/material";
import { ClaimsData } from "../../../../../app/types/claims";

interface CustomerPropertySectionProps {
  data: ClaimsData;
  getters: {
    getPropertyInfo: () => {
      address: string;
      customers: Array<{
        id: number;
        name: string;
        last_name: string;
        email?: string;
        role?: string;
      }>;
    };
  };
}

export const CustomerPropertySection: React.FC<
  CustomerPropertySectionProps
> = ({ getters }) => {
  const propertyInfo = getters.getPropertyInfo();

  const capitalize = (str: string): string => {
    return str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography>
          <strong>Property:</strong> {propertyInfo.address}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            mt: 2,
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            padding: 2,
            border: "1px solid #e2e8f0",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "600",
              color: "#15803D",
              mb: 2,
              borderBottom: "2px solid #e2e8f0",
              paddingBottom: 1,
            }}
          >
            Customers associated with this property:
          </Typography>
          {propertyInfo.customers.length > 0 ? (
            <Box sx={{ pl: 1 }}>
              {propertyInfo.customers.map((customer, index) => (
                <Typography
                  key={customer.id}
                  variant="body1"
                  sx={{
                    mb: 1.5,
                    fontWeight: "500",
                    "& strong": {
                      color: "#1e293b",
                      letterSpacing: "0.01em",
                    },
                  }}
                >
                  <span
                    style={{
                      marginRight: "8px",
                      fontWeight: "bold",
                      color: "#64748b",
                    }}
                  >
                    {index + 1}.
                  </span>
                  <strong>
                    {customer.name} {customer.last_name}
                  </strong>
                  {customer.email && (
                    <strong style={{ color: "#475569" }}>
                      {" "}
                      ({customer.email})
                    </strong>
                  )}
                  {customer.role && (
                    <strong style={{ color: "#64748b" }}>
                      {" "}
                      - ({capitalize(customer.role)})
                    </strong>
                  )}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{ fontStyle: "italic", color: "#64748b", pl: 1 }}
            >
              No customers associated with this property.
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
