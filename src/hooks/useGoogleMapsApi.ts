// useGoogleMapsApi.ts
import { useState, useEffect, useRef, useCallback } from "react";

interface UseGoogleMapsApiProps {
  apiKey: string;
  onAddressSelect: (place: google.maps.places.PlaceResult) => void;
}

export function useGoogleMapsApi({
  apiKey,
  onAddressSelect,
}: UseGoogleMapsApiProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlaceSelect = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      onAddressSelect(place);
    }
  }, [autocomplete, onAddressSelect]);

  const initAutocomplete = useCallback(() => {
    if (inputRef.current && window.google && !autocomplete) {
      try {
        const autocompleteInstance = new window.google.maps.places.Autocomplete(
          inputRef.current,
          { types: ["address"] }
        );
        autocompleteInstance.addListener("place_changed", handlePlaceSelect);
        setAutocomplete(autocompleteInstance);
      } catch (error) {
        setError("Failed to initialize Google Maps Autocomplete");
      }
    }
  }, [handlePlaceSelect, autocomplete]);

  useEffect(() => {
    if (!apiKey) {
      setError(
        "Google Maps API key is missing. Please check your environment variables."
      );
      return;
    }

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        initAutocomplete();
      };
      script.onerror = () => setError("Failed to load Google Maps API");
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
      initAutocomplete();
    }

    return () => {
      if (autocomplete) {
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [apiKey, initAutocomplete, autocomplete]);

  return { inputRef, isLoaded, error };
}
