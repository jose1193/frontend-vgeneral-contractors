// components/UsernameField.tsx
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Field, FieldProps } from "formik";
import { TextField, CircularProgress, Typography } from "@mui/material";
import { checkUsernameAvailable } from "../lib/api";
import { useSession } from "next-auth/react";

interface UsernameFieldProps {
  field: any;
  form: any;
}

const UsernameField: React.FC<UsernameFieldProps> = ({ field, form }) => {
  const [usernameAvailability, setUsernameAvailability] = useState<
    boolean | null
  >(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();

  const handleUsernameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const username = event.target.value;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setDebouncedUsername(username);
      }, 300);
    },
    []
  );

  useEffect(() => {
    const checkUsername = async () => {
      if (!debouncedUsername) {
        setUsernameAvailability(null);
        setErrorMessage(null);
        return;
      }

      setIsCheckingUsername(true);
      setErrorMessage(null);
      try {
        const result = await checkUsernameAvailable(
          session?.accessToken as string,
          debouncedUsername
        );
        setUsernameAvailability(result.available);
      } catch (error) {
        console.error("Failed to check username availability", error);
        setUsernameAvailability(null);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage("An unknown error occurred");
        }
      } finally {
        setIsCheckingUsername(false);
      }
    };

    checkUsername();
  }, [debouncedUsername, session?.accessToken]);

  return (
    <>
      <TextField
        sx={{ mb: 2 }}
        {...field}
        fullWidth
        label="Username"
        variant="outlined"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          form.setFieldValue("username", e.target.value);
          handleUsernameChange(e);
        }}
        error={
          !!(form.touched.username && form.errors.username) || !!errorMessage
        }
        helperText={
          form.touched.username && form.errors.username ? (
            String(form.errors.username)
          ) : errorMessage ? (
            errorMessage
          ) : usernameAvailability === false ? (
            <Typography
              variant="caption"
              style={{ color: "red" }}
              display="block"
              gutterBottom
            >
              Username is already taken
            </Typography>
          ) : usernameAvailability === true ? (
            <Typography
              variant="caption"
              style={{ color: "green" }}
              display="block"
              gutterBottom
            >
              Username is available
            </Typography>
          ) : undefined
        }
      />
      {isCheckingUsername && <CircularProgress size={20} />}
    </>
  );
};

export default UsernameField;
