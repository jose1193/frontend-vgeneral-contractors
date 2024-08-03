import React, { useState, useRef, useCallback, useEffect } from "react";
import { TextField, CircularProgress, Typography } from "@mui/material";
import { checkEmailAvailable } from "../lib/api";
import { useSession } from "next-auth/react";
import { Controller, useFormContext } from "react-hook-form";

const EmailField: React.FC = () => {
  const [emailAvailability, setEmailAvailability] = useState<boolean | null>(
    null
  );
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [debouncedEmail, setDebouncedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();
  const { control } = useFormContext();

  const handleEmailChange = useCallback((email: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedEmail(email);
    }, 300);
  }, []);

  useEffect(() => {
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
    <Controller
      name="email"
      control={control}
      rules={{
        required: "Email is required",
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Invalid email address",
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            {...field}
            fullWidth
            label="Email Address"
            variant="outlined"
            onChange={(e) => {
              field.onChange(e);
              handleEmailChange(e.target.value);
            }}
            error={!!error || !!errorMessage || emailAvailability === false}
            helperText={
              error?.message ||
              errorMessage ||
              (emailAvailability === false && (
                <Typography
                  variant="caption"
                  style={{ color: "red" }}
                  display="block"
                  gutterBottom
                >
                  Email is already taken
                </Typography>
              )) ||
              (emailAvailability === true && (
                <Typography
                  variant="caption"
                  style={{ color: "green" }}
                  display="block"
                  gutterBottom
                >
                  Email is available
                </Typography>
              ))
            }
          />
          {isCheckingEmail && <CircularProgress size={20} />}
        </>
      )}
    />
  );
};

export default EmailField;
