"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
};

type MapProps = {
  lat: number | string;
  lng: number | string;
};

export const Map = ({ lat, lng }: MapProps) => {
  const center = {
    lat: parseFloat(lat as string) || 0,
    lng: parseFloat(lng as string) || 0
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={16}>
        <Marker position={center} draggable={false} />
      </GoogleMap>
    </LoadScript>
  );
};
