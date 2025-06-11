import { FilterState } from "../../types";

type FilterControlsProps = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  options: {
    roles: string[];
    types: string[];
    regions: string[];
    exchanges: string[];
  };
};

export default function EmployeeFilterControls({
  filters,
  setFilters,
  options
}: FilterControlsProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm text-slate-300 mb-2">Role</label>
        <select
          value={filters.role}
          onChange={(e) => updateFilter("role", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All Roles</option>
          {options.roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Type</label>
        <select
          value={filters.type}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All Types</option>
          {options.types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Region</label>
        <select
          value={filters.region}
          onChange={(e) => updateFilter("region", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All Regions</option>
          {options.regions.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-slate-300 mb-2">Exchange</label>
        <select
          value={filters.exchange}
          onChange={(e) => updateFilter("exchange", e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        >
          <option value="">All Exchanges</option>
          {options.exchanges.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
