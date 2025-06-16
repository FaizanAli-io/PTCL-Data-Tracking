"use client";

import { useCallback } from "react";
import { useGeolocation } from "./hooks/useGeolocation";
import { useNetworkData } from "./hooks/useNetworkData";
import { DataTable } from "./components/data/DataTable";
import { MapSection } from "./components/data/MapSection";
import { EmptyState } from "./components/data/EmptyState";
import { PageHeader } from "./components/layout/PageHeader";
import { ControlPanel } from "./components/form/ControlPanel";
import { BackgroundEffects } from "./components/layout/BackgroundEffects";

export default function NetworkPage() {
  const { lat, lng, isGettingLocation, getCurrentPosition, setCoordinates } = useGeolocation();
  const { fdh, fat, isLoading, fetchNetworkData } = useNetworkData();

  const handleLatChange = useCallback(
    (value: string) => {
      setCoordinates(value, lng);
    },
    [lng, setCoordinates]
  );

  const handleLngChange = useCallback(
    (value: string) => {
      setCoordinates(lat, value);
    },
    [lat, setCoordinates]
  );

  const handleSearch = useCallback(() => {
    fetchNetworkData(lat, lng);
  }, [lat, lng, fetchNetworkData]);

  const showEmptyState =
    Boolean(lat) && Boolean(lng) && fdh.length === 0 && fat.length === 0 && !isLoading;
  const showResults = fdh.length > 0 && fat.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 p-4 sm:p-6">
      <BackgroundEffects />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <PageHeader />

        <ControlPanel
          lat={lat}
          lng={lng}
          isGettingLocation={isGettingLocation}
          isLoading={isLoading}
          onGetLocation={getCurrentPosition}
          onLatChange={handleLatChange}
          onLngChange={handleLngChange}
          onSearch={handleSearch}
        />

        <MapSection lat={lat} lng={lng} fdh={fdh} fat={fat} />

        {showResults && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <DataTable
              title="Nearest FDH Locations"
              description="Fiber Distribution Hub locations in your area"
              data={fdh}
            />
            <DataTable
              title="Nearest FAT Locations"
              description="Fiber Access Terminal locations in your area"
              data={fat}
            />
          </div>
        )}

        <EmptyState show={showEmptyState} />
      </div>
    </div>
  );
}
