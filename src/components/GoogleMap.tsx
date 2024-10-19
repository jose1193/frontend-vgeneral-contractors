import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

interface GoogleMapComponentProps {
  latitude: number;
  longitude: number;
}

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = React.memo(
  ({ latitude, longitude }) => {
    const { isLoaded, loadError } = useJsApiLoader({
      googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      libraries: ["places"],
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);

    const center = React.useMemo(
      () => ({
        lat: latitude,
        lng: longitude,
      }),
      [latitude, longitude]
    );

    const onLoad = useCallback((map: google.maps.Map) => {
      setMap(map);
    }, []);

    useEffect(() => {
      if (map) {
        map.setCenter(center);
        map.setZoom(20); // Increased zoom level for a closer view
      }
    }, [map, center]);

    const onUnmount = useCallback(() => {
      setMap(null);
    }, []);

    if (loadError) {
      return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
      return <div>Loading maps</div>;
    }

    return (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={20}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true,
          mapTypeId: "hybrid", // This will show satellite view with street names
          tilt: 45, // This will tilt the view to show more of the building's structure
        }}
      >
        <Marker
          position={center}
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(40, 40),
          }}
        />
      </GoogleMap>
    );
  }
);

GoogleMapComponent.displayName = "GoogleMapComponent";

export default GoogleMapComponent;
