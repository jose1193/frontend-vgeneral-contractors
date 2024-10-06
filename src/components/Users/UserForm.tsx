// UsersForm.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { UserData } from "../../../app/types/user";
import PhoneInputField from "../../../app/components/PhoneInputField";
import EmailField from "../../../app/components/EmailInputField";
import UsernameField from "../../../app/components/UsernameInputField";
import { checkRolesAvailable } from "../../../app/lib/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationSchema } from "./validationSchema";
import AddressAutocomplete from "../../../src/components/AddressAutocomplete";
import useCapitalizeWords from "../../hooks/useCapitalizeWords";
import {
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Box,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";

interface Role {
  id: number;
  name: string;
}

interface UsersFormProps {
  initialData?: UserData;
  onSubmit: (data: UserData) => Promise<void>;
}

const UsersForm: React.FC<UsersFormProps> = ({ initialData, onSubmit }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const capitalizeWords = useCapitalizeWords();
  const methods = useForm<UserData>({
    defaultValues: initialData || {},
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const token = session?.accessToken as string;
        const rolesData = await checkRolesAvailable(token);
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, [session?.accessToken]);

  const handleSubmit = async (data: UserData) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddressSelect = (addressDetails: {
    formatted_address: string;
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }) => {
    console.log("Address details received in UsersForm:", addressDetails);

    methods.setValue("address", addressDetails.formatted_address);

    let zip_code = "";
    let city = "";
    let state = "";
    let country = "";

    addressDetails.address_components.forEach((component) => {
      const { types, long_name } = component;

      if (types.includes("postal_code")) {
        zip_code = long_name;
      } else if (types.includes("locality") || types.includes("postal_town")) {
        city = long_name;
      } else if (types.includes("administrative_area_level_1")) {
        state = long_name;
      } else if (types.includes("country")) {
        country = long_name;
      }
    });

    methods.setValue("zip_code", zip_code);
    methods.setValue("city", city);
    methods.setValue("state", state);
    methods.setValue("country", country);

    console.log("Set values:", { zip_code, city, state, country });

    methods.trigger(["address", "zip_code", "city", "state", "country"]);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Controller
              name="name"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  onChange={(e) =>
                    field.onChange(capitalizeWords(e.target.value))
                  }
                  label="First Name"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="last_name"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  onChange={(e) =>
                    field.onChange(capitalizeWords(e.target.value))
                  }
                  label="Last Name"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <UsernameField />
          </Grid>
          <Grid item xs={12} sm={6}>
            <EmailField />
          </Grid>
          <Grid item xs={12} sm={6}>
            <PhoneInputField name="phone" label="Phone" />
          </Grid>
          <Grid item xs={12}>
            <AddressAutocomplete onAddressSelect={handleAddressSelect} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="zip_code"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Zip Code"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="address"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="city"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="City"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="state"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="State"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="country"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Country"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              name="user_role"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>User Role</InputLabel>
                  <Select {...field} label="User Role">
                    {Array.isArray(roles) &&
                      roles.map((role) => (
                        <MenuItem key={role.id} value={role.id}>
                          {role.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
                sx={{ mt: 5 }}
              >
                {isSubmitting
                  ? "Submitting..."
                  : initialData
                  ? "Update User"
                  : "Create User"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </FormProvider>
  );
};

export default UsersForm;
