import { useCallback } from "react";

const useCapitalizeWords = () => {
  const capitalizeWords = useCallback((string: string): string => {
    return string.replace(/(?:^|\s)\S/g, function (a: string) {
      return a.toUpperCase();
    });
  }, []);

  return capitalizeWords;
};

export default useCapitalizeWords;
