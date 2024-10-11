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

import useCapitalizeWords from "../../hooks/useCapitalizeWords";
import dynamic from "next/dynamic";
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
  Checkbox,
  FormControlLabel,
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

// Dynamic import for AddressAutocomplete
const AddressAutocomplete = dynamic(
  () => import("../../../src/components/AddressAutocomplete"),
  {
    loading: () => <CircularProgress />,
    ssr: false,
  }
);

// Dynamic import for GoogleMapComponent
const GoogleMapComponent = dynamic(() => import("../GoogleMap"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

const UsersForm: React.FC<UsersFormProps> = ({ initialData, onSubmit }) => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 0, lng: 0 });
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

        // Si tenemos initialData y roles, buscamos el rol por nombre
        if (initialData?.user_role && rolesData.length > 0) {
          const initialRole = rolesData.find(
            (role: Role) => role.name === initialData.user_role
          );
          if (initialRole) {
            methods.setValue("user_role", initialRole.id);
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setRoles([]);
      }
    };

    fetchRoles();
  }, [session?.accessToken, initialData, methods]);

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
  useEffect(() => {
    if (initialData && initialData.address) {
      methods.setValue("address", initialData.address);
      if (initialData.latitude && initialData.longitude) {
        setMapCoordinates({
          lat: initialData.latitude,
          lng: initialData.longitude,
        });
      }
    }
  }, [initialData, methods]);

  const handleAddressSelect = (addressDetails: any) => {
    console.log("Address details received in UsersForm:", addressDetails);
    if (addressDetails.latitude && addressDetails.longitude) {
      setMapCoordinates({
        lat: addressDetails.latitude,
        lng: addressDetails.longitude,
      });
      methods.setValue("latitude", addressDetails.latitude);
      methods.setValue("longitude", addressDetails.longitude);
      methods.setValue("address", addressDetails.address);
      // Opcionalmente, actualiza otros campos si están disponibles en addressDetails
      if (addressDetails.city) methods.setValue("city", addressDetails.city);
      if (addressDetails.state) methods.setValue("state", addressDetails.state);
      if (addressDetails.country)
        methods.setValue("country", addressDetails.country);
      if (addressDetails.zip_code)
        methods.setValue("zip_code", addressDetails.zip_code);
    }
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
          <Grid item xs={12} sm={6}>
            <AddressAutocomplete
              onAddressSelect={handleAddressSelect}
              name="address"
              label="Address"
              defaultValue={initialData?.address || ""}
            />
          </Grid>
          {initialData && (
            <Grid item xs={12}>
              {mapCoordinates.lat !== 0 && mapCoordinates.lng !== 0 && (
                <Box
                  height={400}
                  width="100%"
                  position="relative"
                  sx={{ mb: 5 }}
                >
                  <GoogleMapComponent
                    latitude={mapCoordinates.lat}
                    longitude={mapCoordinates.lng}
                  />
                </Box>
              )}
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <Controller
              name="address_2"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Address 2 (Optional)"
                  fullWidth
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          </Grid>

          <input type="hidden" {...methods.register("city")} />
          <input type="hidden" {...methods.register("state")} />
          <input type="hidden" {...methods.register("country")} />
          <input type="hidden" {...methods.register("zip_code")} />
          <input type="hidden" {...methods.register("latitude")} />
          <input type="hidden" {...methods.register("longitude")} />

          <Grid item xs={12} sm={6}>
            <Controller
              name="user_role"
              control={methods.control}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>User Role</InputLabel>
                  <Select {...field} label="User Role">
                    {Array.isArray(roles) &&
                      roles.map((role: Role) => (
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
          {initialData && (
            <Grid item xs={12}>
              <Controller
                name="generate_password"
                control={methods.control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox {...field} checked={field.value || false} />
                    }
                    label="Generate New Password"
                  />
                )}
              />
            </Grid>
          )}
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
