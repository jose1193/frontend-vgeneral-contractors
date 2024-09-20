import React from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import { CustomerData } from "../../app/types/customer";

interface SelectCustomerProps {
  control: any;
  customers: CustomerData[];
  errors: any;
}

export default function SelectCustomer({
  control,
  customers,
  errors,
}: SelectCustomerProps) {
  return (
    <Controller
      name="customer_id"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.customer_id}>
          <Select
            {...field}
            multiple
            input={<OutlinedInput label="Customers" />}
            renderValue={(selected) =>
              `${
                (selected as (number | undefined)[]).filter(
                  (id) => id !== undefined
                ).length
              } selected`
            }
          >
            {customers.length > 0 ? (
              customers.map((customer) => (
                <MenuItem key={customer.id ?? "no-id"} value={customer.id}>
                  <Checkbox
                    checked={
                      customer.id !== undefined &&
                      (field.value as (number | undefined)[]).indexOf(
                        customer.id
                      ) > -1
                    }
                  />
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {`${customer.name.toUpperCase()} ${customer.last_name.toUpperCase()}`}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        style={{ fontWeight: "bold" }}
                      >
                        {`(${customer.email})`}
                      </Typography>
                    }
                  />
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No customers available</MenuItem>
            )}
          </Select>
        </FormControl>
      )}
    />
  );
}
