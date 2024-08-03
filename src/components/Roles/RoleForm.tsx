import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { RolesData, Permission } from "../../../app/types/roles";
import { checkPermissionsAvailable } from "../../../app/lib/actions/rolesActions";
import { useSession } from "next-auth/react";

interface RoleFormProps {
  initialData?: RolesData;
  onSubmit: (data: RolesData) => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<RolesData>({
    defaultValues: initialData || { name: "", permissions: [] },
  });
  const { data: session } = useSession();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = session?.accessToken as string;
        const permissionsData = await checkPermissionsAvailable(token);
        setPermissions(permissionsData);
      } catch (error) {
        console.error("Error fetching permissions:", error);
        setPermissions([]);
      }
    };

    fetchPermissions();
  }, [session?.accessToken]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="name"
          control={control}
          rules={{ required: "Name is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label="Name"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="permissions"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel>Permissions</InputLabel>
              <Select
                {...field}
                multiple
                input={<OutlinedInput label="Permissions" />}
                renderValue={(selected) =>
                  (selected as number[]).length + " selected"
                }
              >
                {permissions.map((permission) => (
                  <MenuItem key={permission.id} value={permission.id}>
                    <Checkbox
                      checked={
                        (field.value as number[]).indexOf(permission.id) > -1
                      }
                    />
                    <ListItemText primary={permission.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update" : "Create"} Role
        </Button>
      </Box>
    </form>
  );
};
