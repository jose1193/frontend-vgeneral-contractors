import React, { useState, useRef, useCallback, useEffect } from "react";
import { TextField, CircularProgress, Typography } from "@mui/material";
import { checkUsernameAvailable } from "../lib/api";
import { useSession } from "next-auth/react";
import { Controller, useFormContext } from "react-hook-form";

const UsernameField: React.FC = () => {
  const [usernameAvailability, setUsernameAvailability] = useState<
    boolean | null
  >(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [debouncedUsername, setDebouncedUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();
  const { control } = useFormContext();

  const handleUsernameChange = useCallback((username: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedUsername(username);
    }, 300);
  }, []);

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
    <Controller
      name="username"
      control={control}
      rules={{
        required: "Username is required",
        minLength: {
          value: 3,
          message: "Username must be at least 3 characters long",
        },
        pattern: {
          value: /^[a-zA-Z0-9_]+$/,
          message:
            "Username can only contain letters, numbers, and underscores",
        },
      }}
      render={({ field, fieldState: { error } }) => (
        <>
          <TextField
            {...field}
            fullWidth
            label="Username"
            variant="outlined"
            onChange={(e) => {
              field.onChange(e);
              handleUsernameChange(e.target.value);
            }}
            error={!!error || !!errorMessage || usernameAvailability === false}
            helperText={
              error?.message ||
              errorMessage ||
              (usernameAvailability === false && (
                <Typography
                  variant="caption"
                  style={{ color: "red" }}
                  display="block"
                  gutterBottom
                >
                  Username is already taken
                </Typography>
              )) ||
              (usernameAvailability === true && (
                <Typography
                  variant="caption"
                  style={{ color: "green" }}
                  display="block"
                  gutterBottom
                >
                  Username is available
                </Typography>
              ))
            }
          />
          {isCheckingUsername && <CircularProgress size={20} />}
        </>
      )}
    />
  );
};

export default UsernameField;
