import { useCallback } from "react";

const usePhoneFormatter = () => {
  const formatPhoneNumber = useCallback((phoneNumber: string): string => {
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "");

    // Check if the number starts with the country code (e.g., 1 for US)
    const hasCountryCode = cleaned.length === 11 && cleaned.startsWith("1");

    // If it has a country code, remove it
    const numberToFormat = hasCountryCode ? cleaned.slice(1) : cleaned;

    // Ensure the number has exactly 10 digits
    if (numberToFormat.length !== 10) {
      return phoneNumber; // Return the original if not 10 digits
    }

    // Format the number (XXX) XXX-XXXX
    return `(${numberToFormat.slice(0, 3)}) ${numberToFormat.slice(
      3,
      6
    )}-${numberToFormat.slice(6)}`;
  }, []);

  return formatPhoneNumber;
};

export default usePhoneFormatter;
