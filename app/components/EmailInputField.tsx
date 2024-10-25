import React, { useState, useRef, useCallback, useEffect } from "react";
import { TextField, CircularProgress, Typography } from "@mui/material";
import { checkEmailAvailable } from "../lib/api";
import { useSession } from "next-auth/react";
import { Controller, useFormContext } from "react-hook-form";

interface EmailResponse {
  success: boolean;
  data: {
    available: boolean;
    message: string;
  };
  message: number;
}

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
        const response = await checkEmailAvailable(
          session?.accessToken as string,
          debouncedEmail
        );

        setEmailAvailability(response.data.available);
        if (!response.data.available) {
          setErrorMessage(response.data.message);
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
  }, [debouncedEmail, session?.accessToken]);

  const getHelperTextStyle = () => {
    if (emailAvailability === true) {
      return { color: "#2e7d32" }; // Verde de Material-UI success
    } else if (emailAvailability === false || errorMessage) {
      return { color: "#d32f2f" }; // Rojo de Material-UI error
    }
    return {};
  };

  const getHelperText = () => {
    if (errorMessage) {
      return errorMessage;
    } else if (emailAvailability === true) {
      return "Email is available ✓";
    } else if (emailAvailability === false) {
      return "Email is already taken ✗";
    }
    return "";
  };

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
      render={({
        field: { onChange, value, ...restField },
        fieldState: { error },
      }) => (
        <div className="relative w-full">
          <TextField
            {...restField}
            value={value || ""}
            fullWidth
            label="Email Address"
            variant="outlined"
            onChange={(e) => {
              onChange(e);
              handleEmailChange(e.target.value);
            }}
            error={!!error || !!errorMessage || emailAvailability === false}
            helperText={
              <div className="flex items-center gap-2 mt-1">
                {isCheckingEmail ? (
                  <div className="flex items-center gap-2">
                    <CircularProgress size={16} />
                    <span>Checking availability...</span>
                  </div>
                ) : (
                  <span style={getHelperTextStyle()}>
                    {error?.message || getHelperText()}
                  </span>
                )}
              </div>
            }
            InputProps={{
              style: {
                borderColor: emailAvailability === true ? "#2e7d32" : undefined,
              },
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      )}
    />
  );
};

export default EmailField;
