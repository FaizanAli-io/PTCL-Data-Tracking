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

import PasswordGate from "@/components/PasswordGate";

export default function NetworkPage() {
  const { lat, lng, isGettingLocation, getCurrentPosition, setCoordinates } = useGeolocation();
  const { FDH, FAT, DC, DP, isLoading, fetchNetworkData } = useNetworkData();

  const [thresholdEnabled, setThresholdEnabled] = useState(false);
  const [type, setType] = useState<"GPON" | "XDSL">("GPON");
  const [threshold, setThreshold] = useState("10000");
  const [limit, setLimit] = useState("5");

  const cleanFDH = FDH.map((row) => ({
    Region: row.Region,
    Exchange: row.Exchange.slice(4),
    "FDH ID": row["FDH MXID"],
    Capacity: `${row["Spare Capacity"]} / ${row["Capacity FDH"]}`,
    Loading: (row["% LOADING"] * 100).toFixed(1) + "%",
    "FAT Count": row["FAT COUNT"],
    Latitude: row.LAT,
    Longitude: row.LOG,
    Distance: row.distance + " meters"
  }));

  const cleanFAT = FAT.map((row) => ({
    Region: row.Region,
    Division: row.Division,
    "FDH ID": row["FDH MXID"],
    "FAT ID": row["FAT MXID"],
    Capacity: row.CAPACITY,
    Latitude: row.LAT,
    Longitude: row.LOG,
    Distance: row.distance + " meters"
  }));

  const cleanDC = DC.map((row) => ({
    Region: row.Region,
    Exchange: row.Exchange,
    "DC Name": row["DC Name"],
    "DC ID": row["DC ID"],
    "DP Count": row["DP Count"],
    Capacity: row["DC Capacity"],
    Loading: row["DC Loading"],
    "Loading %": (row["Loading %"] * 100).toFixed(1) + "%",
    Spare: row["DC Spare Capacity"],
    Latitude: row.LAT,
    Longitude: row.LOG,
    Distance: row.distance + " meters"
  }));

  const cleanDP = DP.map((row) => ({
    Region: row.Region,
    Exchange: row.Exchange,
    "DC Name": row["DC Name"],
    "DC MXID": row["DC MXID"],
    "DP MXID": row["DP MXID"],
    "DP Name": row["DP Name"],
    Capacity: row["DP Capacity"],
    Loading: row["DP Loading"],
    Latitude: row.LAT,
    Longitude: row.LOG,
    Distance: row.distance + " meters"
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
      thresholdEnabled,
      type
    });
  }, [lat, lng, threshold, limit, thresholdEnabled, type, fetchNetworkData]);

  const showEmptyState =
    Boolean(lat) &&
    Boolean(lng) &&
    !isLoading &&
    ((type === "GPON" && FDH.length === 0 && FAT.length === 0) ||
      (type === "XDSL" && DC.length === 0 && DP.length === 0));

  const showResults =
    (type === "GPON" && FDH.length > 0 && FAT.length > 0) ||
    (type === "XDSL" && DC.length > 0 && DP.length > 0);

  return (
    <PasswordGate correctPassword={process.env.NEXT_PUBLIC_PWD2}>
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
            type={type}
            onThresholdToggle={setThresholdEnabled}
            onThresholdChange={setThreshold}
            onLimitChange={setLimit}
            onTypeChange={(val) => setType(val as "GPON" | "XDSL")}
          />

          <MapSection
            lat={lat}
            lng={lng}
            type={type}
            primaryData={type === "GPON" ? FDH : DC}
            secondaryData={type === "GPON" ? FAT : DP}
          />

          {showResults && (
            <div className="space-y-8">
              {type === "GPON" ? (
                <>
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
                </>
              ) : (
                <>
                  <DataTable
                    title="Nearest DC Locations"
                    description="Distribution Cabinet locations in your area"
                    data={cleanDC}
                  />
                  <DataTable
                    title="Nearest DP Locations"
                    description="Distribution Point locations in your area"
                    data={cleanDP}
                  />
                </>
              )}
            </div>
          )}

          <EmptyState show={showEmptyState} type={type} />
        </div>
      </div>
    </PasswordGate>
  );
}
