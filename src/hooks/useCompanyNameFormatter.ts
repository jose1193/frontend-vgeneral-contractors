import { useCallback } from "react";

/**
 * Hook personalizado que formatea nombres de empresas según reglas específicas:
 * - Palabras comunes (artículos, preposiciones, etc.) van en minúsculas (excepto si son primera o última)
 * - Palabras cortas de 1-2 letras van en mayúsculas (excepto si están en la lista de palabras comunes)
 * - Las demás palabras se capitalizan
 * - Preserva los espacios originales
 */
const useCompanyNameFormatter = () => {
  const formatCompanyName = useCallback((name: string): string => {
    if (!name || name.trim() === "") {
      return name;
    }

    const lowercaseWords = [
      "and",
      "or",
      "the",
      "in",
      "on",
      "at",
      "to",
      "for",
      "of",
    ];

    const words = name.split(/(\s+)/);

    const formattedWords = words.map((word, index, array) => {
      // Preservar espacios
      if (word.trim() === "") {
        return word;
      }

      const lowerWord = word.toLowerCase();

      // Primera palabra o última palabra siempre capitalizada
      if (index === 0 || index === array.length - 1) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }

      // Verificar primero si está en la lista de palabras en minúsculas
      if (lowercaseWords.includes(lowerWord)) {
        return lowerWord;
      }

      // Si es palabra corta (1-2 letras) y no está en la lista de palabras comunes
      if (word.length <= 2) {
        return word.toUpperCase();
      }

      // Para todas las demás palabras
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });

    return formattedWords.join("");
  }, []);

  return formatCompanyName;
};

export default useCompanyNameFormatter;
