import { useCallback } from "react";

const usePhoneFormatter = () => {
  const formatPhoneNumber = useCallback(
    (phoneNumber: string | null | undefined): string => {
      // If phoneNumber is null or undefined, return an empty string
      if (phoneNumber == null) {
        return "";
      }

      // Remove all non-digit characters
      const cleaned = phoneNumber.replace(/\D/g, "");

      // Check if the number starts with the country code (e.g., 1 for US)
      const hasCountryCode = cleaned.length === 11 && cleaned.startsWith("1");

      // If it has a country code, remove it
      const numberToFormat = hasCountryCode ? cleaned.slice(1) : cleaned;

      // If the number doesn't have 10 digits, return the original input
      if (numberToFormat.length !== 10) {
        return phoneNumber;
      }

      // Format the number (XXX) XXX-XXXX
      return `(${numberToFormat.slice(0, 3)}) ${numberToFormat.slice(
        3,
        6
      )}-${numberToFormat.slice(6)}`;
    },
    []
  );

  return formatPhoneNumber;
};

export default usePhoneFormatter;
