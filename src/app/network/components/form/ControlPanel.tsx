import { SearchOptions } from "./SearchOptions";
import { CoordinateInput } from "./CoordinateInput";
import { Navigation, Search, Loader2 } from "lucide-react";

interface ControlPanelProps {
  lat: string;
  lng: string;
  isGettingLocation: boolean;
  isLoading: boolean;
  onGetLocation: () => void;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  onSearch: () => void;
  thresholdEnabled: boolean;
  threshold: string;
  limit: string;
  type: string;
  onThresholdToggle: (enabled: boolean) => void;
  onThresholdChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

export const ControlPanel = ({
  lat,
  lng,
  isGettingLocation,
  isLoading,
  onGetLocation,
  onLatChange,
  onLngChange,
  onSearch,
  thresholdEnabled,
  threshold,
  limit,
  type,
  onThresholdToggle,
  onThresholdChange,
  onLimitChange,
  onTypeChange
}: ControlPanelProps) => (
  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
    <div className="flex flex-col lg:flex-row gap-4 items-center">
      <button
        onClick={onGetLocation}
        disabled={isGettingLocation}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-fit"
      >
        {isGettingLocation ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Navigation className="w-5 h-5" />
        )}
        {isGettingLocation ? "Getting Location..." : "Get Customer Location"}
      </button>

      <CoordinateInput lat={lat} lng={lng} onLatChange={onLatChange} onLngChange={onLngChange} />
    </div>

    <div className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
      <div className="w-full lg:flex-1">
        <SearchOptions
          thresholdEnabled={thresholdEnabled}
          threshold={threshold}
          limit={limit}
          type={type}
          onThresholdToggle={onThresholdToggle}
          onThresholdChange={onThresholdChange}
          onLimitChange={onLimitChange}
          onTypeChange={onTypeChange}
        />
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSearch}
          disabled={isLoading || !lat || !lng}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-fit"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          {isLoading ? "Searching..." : "Find Network Points"}
        </button>
      </div>
    </div>
  </div>
);
