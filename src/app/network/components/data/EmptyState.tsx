import { Search } from "lucide-react";

interface EmptyStateProps {
  show: boolean;
  type: string;
}

export const EmptyState = ({ show, type }: EmptyStateProps) => {
  if (!show) return null;

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 text-center shadow-2xl">
      <div className="max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
          <Search className="w-8 h-8 text-purple-300" />
        </div>
        <h3 className="text-xl font-semibold text-purple-100">No Results Found</h3>
        <p className="text-purple-200/70">
          No {type === "GPON" ? "FDH or FAT" : "DP or DC"} locations found near the specified
          coordinates. Try adjusting your location or search radius.
        </p>
      </div>
    </div>
  );
};
