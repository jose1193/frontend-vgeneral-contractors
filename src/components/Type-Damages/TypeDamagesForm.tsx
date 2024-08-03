// src/components/TypeDamages/TypeDamageForm.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box } from "@mui/material";
import { TypeDamageData } from "../../../app/types/type-damage";

interface TypeDamageFormProps {
  initialData?: TypeDamageData;
  onSubmit: (data: TypeDamageData) => void;
}

const TypeDamagesForm: React.FC<TypeDamageFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeDamageData>({
    defaultValues: initialData || {
      type_damage_name: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Controller
          name="type_damage_name"
          control={control}
          rules={{ required: "Type Damage Name is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Type Damage Name"
              variant="outlined"
              fullWidth
              error={!!errors.type_damage_name}
              helperText={errors.type_damage_name?.message}
            />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
            />
          )}
        />

        <Button type="submit" variant="contained" color="primary">
          {initialData ? "Update" : "Create"} Type Damage
        </Button>
      </Box>
    </form>
  );
};

export default TypeDamagesForm;
