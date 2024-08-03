// components/EmailField.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Field, FieldProps } from "formik";
import { TextField, CircularProgress, Typography } from "@mui/material";
import { checkEmailAvailable } from "../lib/api";
import { useSession } from "next-auth/react";

interface EmailFieldProps {
  field: any;
  form: any;
}

const EmailField: React.FC<EmailFieldProps> = ({ field, form }) => {
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(
    null
  );
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();

  const handleEmailChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const email = event.target.value;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setDebouncedEmail(email);
      }, 300);
    },
    []
  );

  React.useEffect(() => {
    const checkEmail = async () => {
      if (!debouncedEmail) {
        setEmailAvailability(null);
        setErrorMessage(null);
        return;
      }

      setIsCheckingEmail(true);
      setErrorMessage(null);
      try {
        const result = await checkEmailAvailable(
          session?.accessToken as string,
          debouncedEmail
        );
        setEmailAvailability(result.available);
      } catch (error) {
        console.error("Failed to check email availability", error);
        setEmailAvailability(null);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      } finally {
        setIsCheckingEmail(false);
      }
    };

    checkEmail();
  }, [debouncedEmail, session?.accessToken]);

  return (
    <>
      <TextField
        sx={{ mb: 2 }}
        {...field}
        fullWidth
        label="Email Address"
        variant="outlined"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          form.setFieldValue("email", e.target.value);
          handleEmailChange(e);
        }}
        error={!!(form.touched.email && form.errors.email) || !!errorMessage}
        helperText={
          form.touched.email && form.errors.email ? (
            String(form.errors.email)
          ) : errorMessage ? (
            errorMessage
          ) : emailAvailability === false ? (
            <Typography
              variant="caption"
              style={{ color: "red" }}
              display="block"
              gutterBottom
            >
              Email is already taken
            </Typography>
          ) : emailAvailability === true ? (
            <Typography
              variant="caption"
              style={{ color: "green" }}
              display="block"
              gutterBottom
            >
              Email is available
            </Typography>
          ) : undefined
        }
      />
      {isCheckingEmail && <CircularProgress size={20} />}
    </>
  );
};

export default EmailField;
