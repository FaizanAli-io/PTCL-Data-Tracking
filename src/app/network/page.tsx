"use client";

import { useCallback, useState } from "react";
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

  const [thresholdEnabled, setThresholdEnabled] = useState(false);
  const [threshold, setThreshold] = useState("10000");
  const [limit, setLimit] = useState("10");

  const cleanFDH = fdh.map((row) => ({
    Region: row.Region,
    Exchange: row.Exchange.slice(4),
    "FDH ID": row["FDH MXID"],
    Capacity: `${row["Spare Capacity"]} / ${row["Capacity FDH"]}`,
    Loading: (row["% LOADING"] * 100).toFixed(1) + "%",
    "FAT Count": row["FAT COUNT"],
    Latitude: row.LAT,
    Longitude: row.LOG,
    Distance: (row.distance / 1000).toFixed(2) + " km"
  }));

  const cleanFAT = fat.map((row) => ({
    Region: row.Region,
    Division: row.Division,
    "FDH ID": row["FDH MXID"],
    "FAT ID": row["FAT MXID"],
    Capacity: row.CAPACITY,
    Latitude: row.LAT,
    Longitude: row.LOG,
    Distance: (row.distance / 1000).toFixed(2) + " km"
  }));

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
    fetchNetworkData(lat, lng, {
      threshold: parseFloat(threshold),
      limit: parseInt(limit),
      thresholdEnabled
    });
  }, [lat, lng, threshold, limit, thresholdEnabled, fetchNetworkData]);

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
          thresholdEnabled={thresholdEnabled}
          threshold={threshold}
          limit={limit}
          onThresholdToggle={setThresholdEnabled}
          onThresholdChange={setThreshold}
          onLimitChange={setLimit}
        />

        <MapSection lat={lat} lng={lng} fdh={fdh} fat={fat} />

        {showResults && (
          <div className="space-y-8">
            <DataTable
              title="Nearest FDH Locations"
              description="Fiber Distribution Hub locations in your area"
              data={cleanFDH}
            />
            <DataTable
              title="Nearest FAT Locations"
              description="Fiber Access Terminal locations in your area"
              data={cleanFAT}
            />
          </div>
        )}

        <EmptyState show={showEmptyState} />
      </div>
    </div>
  );
}
