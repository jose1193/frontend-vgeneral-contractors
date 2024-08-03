// components/PhoneInputField.tsx
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Typography } from "@mui/material";
import { useTheme } from "../ui/StyledRoot";

const CustomPhoneInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => {
  const { darkMode } = useTheme();

  return (
    <PhoneInput
      country={"us"}
      value={value}
      onChange={onChange}
      inputStyle={{
        marginBottom: 15,
        width: "100%",
        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "#fff",
      }}
      containerStyle={{ width: "100%" }}
      dropdownStyle={{}}
      buttonStyle={{}}
    />
  );
};

const PhoneField: React.FC = () => {
  const { control } = useFormContext();
  const theme = useTheme();

  return (
    <Controller
      name="phone"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <CustomPhoneInput value={value} onChange={onChange} />
          {error && <Typography color="error">{error.message}</Typography>}
        </>
      )}
    />
  );
};

export default PhoneField;
