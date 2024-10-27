import React from "react";
import { Box, CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";

const GoogleMapComponent = dynamic(() => import("./GoogleMap"), {
  loading: () => <CircularProgress />,
  ssr: false,
});

interface MapSectionProps {
  mapCoordinates: { lat: number; lng: number };
}

const MapSection: React.FC<MapSectionProps> = ({ mapCoordinates }) => {
  if (mapCoordinates.lat === 0 && mapCoordinates.lng === 0) {
    return null;
  }

  return (
    <Box height={400} width="100%" position="relative" sx={{ mt: 2 }}>
      <GoogleMapComponent
        latitude={mapCoordinates.lat}
        longitude={mapCoordinates.lng}
      />
    </Box>
  );
};

export default MapSection;
