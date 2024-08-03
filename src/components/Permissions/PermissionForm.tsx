import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { PermissionData } from "../../../app/types/permissions";

interface PermissionFormProps {
  initialData?: PermissionData;
  onSubmit: (data: PermissionData) => void;
}

export const PermissionForm: React.FC<PermissionFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const { control, handleSubmit } = useForm<PermissionData>({
    defaultValues: initialData || { name: "" },
  });

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

        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update" : "Create"} Permission
        </Button>
      </Box>
    </form>
  );
};
