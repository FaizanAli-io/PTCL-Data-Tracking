import { Loader2 } from "lucide-react";

type ServiceStatusBadgeProps = { label: string; status?: ServiceStatus };

export type ServiceStatus = { available?: boolean; distance?: number; loading?: boolean };

export const ServiceStatusBadge = ({ label, status = {} }: ServiceStatusBadgeProps) => {
  const { available, distance, loading } = status;

  if (loading) {
    return (
      <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-500 border border-gray-200">
        <Loader2 className="animate-spin h-5 w-5" />
        <span>Loading {label}…</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
        available
          ? "bg-green-100 text-green-700 border border-green-200"
          : "bg-red-100 text-red-700 border border-red-200"
      }`}
    >
      <span className="text-xl">{available ? "✅" : "❌"}</span>
      <span>{available ? `${label} (${distance}m)` : `${label} Unavailable`}</span>
    </div>
  );
};
