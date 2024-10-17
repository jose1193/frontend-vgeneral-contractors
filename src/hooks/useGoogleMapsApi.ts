// useGoogleMapsApi.ts
import { useState, useEffect, useCallback } from "react";

interface AddressDetails {
  formatted_address: string;
  address_components: google.maps.GeocoderAddressComponent[];
  latitude: number;
  longitude: number;
}

interface UseGoogleMapsApiProps {
  apiKey: string;
  onAddressSelect?: (addressDetails: AddressDetails) => void;
}

export function useGoogleMapsApi({
  apiKey,
  onAddressSelect,
}: UseGoogleMapsApiProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      setError(
        "Google Maps API key is missing. Please check your environment variables."
      );
      return;
    }

    const loadGoogleMapsApi = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => setError("Failed to load Google Maps API");
        document.body.appendChild(script);
      } else {
        setIsLoaded(true);
      }
    };

    loadGoogleMapsApi();

    return () => {
      setIsLoaded(false);
    };
  }, [apiKey]);

  const initAutocomplete = useCallback(
    (inputElement: HTMLInputElement) => {
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.error("Google Maps API is not loaded");
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(
        inputElement,
        {
          types: ["address"],
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (onAddressSelect && place.geometry && place.geometry.location) {
          const addressDetails: AddressDetails = {
            formatted_address: place.formatted_address || "",
            address_components: place.address_components || [],
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };
          onAddressSelect(addressDetails);
        }
      });

      return autocomplete;
    },
    [onAddressSelect]
  );

  return { initAutocomplete, isLoaded, error };
}
