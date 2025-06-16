import { LocationButton } from "./LocationButton";
import { CoordinateInput } from "./CoordinateInput";
import { SearchButton } from "./SearchButton";

interface ControlPanelProps {
  lat: string;
  lng: string;
  isGettingLocation: boolean;
  isLoading: boolean;
  onGetLocation: () => void;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
  onSearch: () => void;
}

export const ControlPanel = ({
  lat,
  lng,
  isGettingLocation,
  isLoading,
  onGetLocation,
  onLatChange,
  onLngChange,
  onSearch
}: ControlPanelProps) => (
  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl">
    <div className="flex flex-col lg:flex-row gap-4 items-center">
      <LocationButton isGettingLocation={isGettingLocation} onClick={onGetLocation} />

      <CoordinateInput lat={lat} lng={lng} onLatChange={onLatChange} onLngChange={onLngChange} />

      <SearchButton isLoading={isLoading} disabled={isLoading || !lat || !lng} onClick={onSearch} />
    </div>
  </div>
);
