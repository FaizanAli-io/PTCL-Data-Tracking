import { Navigation, Loader2 } from "lucide-react";

interface LocationButtonProps {
  isGettingLocation: boolean;
  onClick: () => void;
}

export const LocationButton = ({ isGettingLocation, onClick }: LocationButtonProps) => (
  <button
    onClick={onClick}
    disabled={isGettingLocation}
    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none min-w-fit"
  >
    {isGettingLocation ? (
      <Loader2 className="w-5 h-5 animate-spin" />
    ) : (
      <Navigation className="w-5 h-5" />
    )}
    {isGettingLocation ? "Getting Location..." : "Get My Location"}
  </button>
);
