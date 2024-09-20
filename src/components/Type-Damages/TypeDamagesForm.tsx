import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Box, CircularProgress } from "@mui/material";
import { TypeDamageData } from "../../../app/types/type-damage";

interface TypeDamageFormProps {
  initialData?: TypeDamageData;
  onSubmit: (data: TypeDamageData) => Promise<void>;
}

const TypeDamagesForm: React.FC<TypeDamageFormProps> = ({
  initialData,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const onSubmitHandler = async (data: TypeDamageData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {isSubmitting
            ? "Submitting..."
            : initialData
            ? "Update Type Damage"
            : "Create Type Damage"}
        </Button>
      </Box>
    </form>
  );
};

export default TypeDamagesForm;
