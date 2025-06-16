import { MapPin } from "lucide-react";

interface CoordinateInputProps {
  lat: string;
  lng: string;
  onLatChange: (value: string) => void;
  onLngChange: (value: string) => void;
}

export const CoordinateInput = ({ lat, lng, onLatChange, onLngChange }: CoordinateInputProps) => (
  <div className="flex flex-col sm:flex-row gap-4 flex-1">
    <div className="relative flex-1">
      <input
        type="number"
        step="any"
        placeholder="Enter latitude"
        value={lat}
        onChange={(e) => onLatChange(e.target.value)}
        className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/40 rounded-xl text-purple-100 placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:bg-purple-800/40 transition-all duration-300"
      />
      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
    </div>

    <div className="relative flex-1">
      <input
        type="number"
        step="any"
        placeholder="Enter longitude"
        value={lng}
        onChange={(e) => onLngChange(e.target.value)}
        className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/40 rounded-xl text-purple-100 placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:bg-purple-800/40 transition-all duration-300"
      />
      <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
    </div>
  </div>
);
