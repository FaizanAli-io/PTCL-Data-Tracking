"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { getMapIcons } from "../../hooks/getMapIcons";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full rounded-2xl bg-gradient-to-br from-purple-900/20 to-purple-600/20 backdrop-blur-xl border border-purple-500/30 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-purple-100">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-medium">Loading map...</p>
      </div>
    </div>
  )
});

interface MapSectionProps {
  lat: string;
  lng: string;
  primaryData: any[];
  secondaryData: any[];
  type: "GPON" | "XDSL";
}

export const MapSection = ({ lat, lng, primaryData, secondaryData, type }: MapSectionProps) => {
  if (!lat || !lng || (primaryData.length === 0 && secondaryData.length === 0)) return null;

  const { userIcon, fdhIcon, fatIcon, dcIcon, dpIcon } = getMapIcons();

  const config = {
    GPON: {
      primaryLabel: "FDH",
      secondaryLabel: "FAT",
      primaryIcon: fdhIcon,
      secondaryIcon: fatIcon
    },
    XDSL: {
      primaryLabel: "DC / MSAG",
      secondaryLabel: "DP",
      primaryIcon: dcIcon,
      secondaryIcon: dpIcon
    }
  }[type];

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-purple-100 mb-2">Network Map</h2>
        <p className="text-purple-200/70">
          Interactive map showing your location and nearby {type} infrastructure
        </p>
      </div>
      <div className="rounded-2xl overflow-hidden border border-purple-500/30">
        <MapView
          userPos={{ lat: parseFloat(lat), lng: parseFloat(lng) }}
          primaryData={primaryData}
          secondaryData={secondaryData}
          primaryLabel={config.primaryLabel}
          secondaryLabel={config.secondaryLabel}
          userIcon={userIcon}
          primaryIcon={config.primaryIcon}
          secondaryIcon={config.secondaryIcon}
        />
      </div>
    </div>
  );
};
