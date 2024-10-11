import { useCallback } from "react";

const useUppercase = () => {
  const convertToUppercase = useCallback((string: string): string => {
    return string.toUpperCase();
  }, []);

  return convertToUppercase;
};

export default useUppercase;
