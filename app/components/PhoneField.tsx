// components/PhoneField.tsx
import React from "react";
import { Field } from "formik";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { Typography } from "@mui/material";
import { useTheme } from "../ui/StyledRoot";

const CustomPhoneInput: React.FC<{
  field: any;
  form: any;
}> = ({ field, form }) => {
  const { darkMode } = useTheme();

  return (
    <PhoneInput
      country={"us"}
      value={field.value}
      onChange={(value) => {
        form.setFieldValue(field.name, value);
      }}
      inputStyle={{
       
        width: "100%",
        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.05)" : "#fff", // Cambiado a blanco para modo claro
      }}
      containerStyle={{ width: "100%" }}
      dropdownStyle={{}}
      buttonStyle={{}}
    />
  );
};

const PhoneField: React.FC = () => {
  const theme = useTheme();

  return (
    <>
      <Field name="phone">
        {({ field, form, meta }: { field: any; form: any; meta: any }) => (
          <>
            <CustomPhoneInput field={field} form={form} />
            {meta.touched && meta.error && (
              <Typography color="error">{meta.error}</Typography>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default PhoneField;
