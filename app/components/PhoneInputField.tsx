import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Typography, FormControl, InputLabel } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface PhoneInputFieldProps {
  name: string;
  label: string;
}

const CustomPhoneInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const theme = useTheme();

  return (
    <FormControl fullWidth>
      <InputLabel shrink htmlFor={`phone-input-${label}`}>
        {label}
      </InputLabel>
      <PhoneInput
        country={"us"}
        value={value}
        onChange={onChange}
        inputProps={{
          name: label,
          required: true,
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
          marginTop: "16px", // Add some space for the label
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
        preferredCountries={["us", "gb", "ca"]}
      />
    </FormControl>
  );
};

const PhoneInputField: React.FC<PhoneInputFieldProps> = ({ name, label }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <CustomPhoneInput value={value} onChange={onChange} label={label} />
          {error && <Typography color="error">{error.message}</Typography>}
        </>
      )}
    />
  );
};

export default PhoneInputField;
