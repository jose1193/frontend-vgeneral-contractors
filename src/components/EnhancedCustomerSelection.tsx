import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  TextField,
  Chip,
  ListSubheader,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { CustomerData } from "../../app/types/customer";

interface EnhancedCustomerSelectionProps {
  control: any;
  customers: CustomerData[];
  errors: any;
}

export default function EnhancedCustomerSelection({
  control,
  customers,
  errors,
}: EnhancedCustomerSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.last_name} ${customer.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <Controller
      name="customer_id"
      control={control}
      render={({ field }) => (
        <FormControl fullWidth error={!!errors.customer_id}>
          <InputLabel id="customers-label">Customers</InputLabel>
          <Select
            {...field}
            multiple
            input={<OutlinedInput label="Customers" />}
            renderValue={(selected) => (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {(selected as number[]).map((id) => {
                  const customer = customers.find((c) => c.id === id);
                  return customer ? (
                    <Chip
                      key={id}
                      label={`${customer.name.toUpperCase()} ${customer.last_name.toUpperCase()}`}
                      onDelete={() => {
                        const newValue = (field.value as number[]).filter(
                          (v) => v !== id
                        );
                        field.onChange(newValue);
                      }}
                    />
                  ) : null;
                })}
              </div>
            )}
          >
            <ListSubheader>
              <TextField
                size="small"
                autoFocus
                placeholder="Type to search..."
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer) => (
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
