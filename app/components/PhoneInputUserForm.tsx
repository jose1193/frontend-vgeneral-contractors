import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Typography, FormControl, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface PhoneInputUserFormProps {
  name: string;
  label: string;
  required?: boolean;
}

const CustomPhoneInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
  required?: boolean;
  error?: string;
  onBlur: () => void;
}> = ({ value, onChange, label, required, error, onBlur }) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  const handleChange = (inputValue: string) => {
    if (!required && inputValue === "") {
      onChange("");
      return;
    }

    // Simplemente pasamos el valor tal cual viene del input
    onChange(inputValue);
    setTouched(true);
  };

  const handleBlur = () => {
    setTouched(true);
    onBlur();
  };

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={`phone-input-${label}`}>
        {label}
      </InputLabel>
      <PhoneInput
        country={"us"}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        inputProps={{
          name: label,
          required: required,
          id: `phone-input-${label}`,
        }}
        inputStyle={{
          width: "100%",
          height: "56px",
          fontSize: "16px",
          paddingLeft: "48px",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "#fff",
          color: theme.palette.text.primary,
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.23)"
              : "rgba(0, 0, 0, 0.23)",
        }}
        containerStyle={{
          width: "100%",
          marginTop: "16px",
        }}
        dropdownStyle={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
        buttonStyle={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.05)"
              : "#fff",
          borderColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.23)"
              : "rgba(0, 0, 0, 0.23)",
        }}
        searchPlaceholder="Search countries"
        searchNotFound="No country found"
        enableSearch={true}
        searchClass="custom-search-class"
        searchStyle={{
          width: "100%",
          marginBottom: "10px",
        }}
        preferredCountries={[
          "us",
          "gb",
          "es",
          "mx",
          "fr",
          "de",
          "it",
          "br",
          "ar",
          "cl",
          "co",
          "pe",
        ]}
      />
      {touched && error && <Typography color="error">{error}</Typography>}
    </FormControl>
  );
};

const PhoneInputUserForm: React.FC<PhoneInputUserFormProps> = ({
  name,
  label,
  required = false,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <CustomPhoneInput
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          label={label}
          required={required}
          error={error?.message}
        />
      )}
    />
  );
};

export default PhoneInputUserForm;
