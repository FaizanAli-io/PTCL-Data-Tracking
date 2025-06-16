import { useState, useCallback } from "react";

interface GeolocationState {
  lat: string;
  lng: string;
  isGettingLocation: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    lat: "",
    lng: "",
    isGettingLocation: false
  });

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setState((prev) => ({ ...prev, isGettingLocation: true }));

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setState({
          lat: coords.latitude.toString(),
          lng: coords.longitude.toString(),
          isGettingLocation: false
        });
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Failed to get location. Please ensure location services are enabled.");
        setState((prev) => ({ ...prev, isGettingLocation: false }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, []);

  const setCoordinates = useCallback((lat: string, lng: string) => {
    setState((prev) => ({ ...prev, lat, lng }));
  }, []);

  return {
    ...state,
    getCurrentPosition,
    setCoordinates
  };
};
