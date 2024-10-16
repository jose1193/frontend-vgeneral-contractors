import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  Typography,
  TextField,
  Chip,
  ListSubheader,
  InputAdornment,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CancelIcon from "@mui/icons-material/Cancel";
import { CustomerData } from "../../app/types/customer";

interface EnhancedCustomerSelectionProps {
  control: any;
  customers: CustomerData[];
  errors: any;
  loading?: boolean;
  onCustomerSelect: (selected: CustomerData | null) => void;
}

export default function EnhancedCustomerSelectionWizard({
  control,
  customers,
  errors,
  loading = false,
  onCustomerSelect,
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
          <InputLabel id="customers-label">Customer </InputLabel>
          <Select
            {...field}
            value={field.value || ""}
            input={<OutlinedInput label="Customer" />}
            onChange={(e) => {
              field.onChange(e.target.value);
              const selectedCustomer = customers.find(
                (c) => c.id === e.target.value
              );
              if (selectedCustomer) {
                onCustomerSelect(selectedCustomer);
              }
            }}
            endAdornment={
              <InputAdornment position="end">
                {loading && <CircularProgress color="inherit" size={20} />}
              </InputAdornment>
            }
            renderValue={(selected) => {
              const customer = customers.find((c) => c.id === selected);
              return customer ? (
                <Chip
                  label={`${customer.name.toUpperCase()} ${customer.last_name.toUpperCase()}`}
                  onDelete={() => {
                    field.onChange("");
                    onCustomerSelect(null);
                  }}
                  deleteIcon={
                    <CancelIcon
                      onMouseDown={(event) => event.stopPropagation()}
                    />
                  }
                />
              ) : null;
            }}
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
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#662401",
                        fontWeight: "bold",

                        flexGrow: 1,
                      }}
                    >
                      {`${customer.name.toUpperCase()} ${customer.last_name.toUpperCase()}`}
                    </Typography>
                    <Typography variant="body2" style={{ fontWeight: "bold" }}>
                      {customer.email}
                    </Typography>
                  </Box>
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
