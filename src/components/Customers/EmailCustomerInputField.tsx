import React, { useState, useRef, useCallback, useEffect } from "react";
import { TextField, CircularProgress, Typography } from "@mui/material";
import { useCustomers } from "../../../src/hooks/useCustomers";
import { useSession } from "next-auth/react";

interface EmailFieldProps {
  field: any;
  form: any;
  uuid?: string;
}

const EmailCustomerInputField: React.FC<EmailFieldProps> = ({
  field,
  form,
  uuid,
}) => {
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(
    null
  );
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(
    null
  );
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();
  const { checkEmailAvailability } = useCustomers(
    session?.accessToken as string
  );

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

  useEffect(() => {
    const checkEmail = async () => {
      if (!debouncedEmail) {
        setEmailAvailability(null);
        setErrorMessage(null);
        setAvailabilityMessage(null);
        return;
      }

      setIsCheckingEmail(true);
      setErrorMessage(null);
      setAvailabilityMessage(null);

      try {
        const response = await checkEmailAvailability(debouncedEmail, uuid);
        if (response.success) {
          setEmailAvailability(response.data.available);
          setAvailabilityMessage(response.data.message);
        } else {
          throw new Error("Failed to check email availability");
        }
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
  }, [debouncedEmail, checkEmailAvailability, uuid]);

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
          ) : availabilityMessage ? (
            <Typography
              variant="caption"
              style={{ color: emailAvailability ? "green" : "red" }}
              display="block"
              gutterBottom
            >
              {availabilityMessage}
            </Typography>
          ) : undefined
        }
      />
      {isCheckingEmail && <CircularProgress size={20} />}
    </>
  );
};

export default EmailCustomerInputField;
