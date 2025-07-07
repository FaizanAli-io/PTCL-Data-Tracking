import { FilterState } from "../../types";

type FilterControlsProps = {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  options: {
    roles: string[];
    types: string[];
    regions: string[];
    exchanges: string[];
    entryTypes: string[];
  };
  exchangeView: boolean;
};

export default function FilterControls({
  filters,
  setFilters,
  options,
  exchangeView
}: FilterControlsProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  const renderSelect = (label: string, key: keyof FilterState, items: string[]) => (
    <div>
      <label className="block text-sm text-slate-300 mb-2">{label}</label>
      <select
        value={filters[key] || ""}
        onChange={(e) => updateFilter(key, e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
      >
        <option value="">All {label}</option>
        {items.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {renderSelect("Role", "role", options.roles)}
      {renderSelect("Employee Type", "type", options.types)}
      {!exchangeView && renderSelect("Region", "region", options.regions)}
      {!exchangeView && renderSelect("Exchange", "exchange", options.exchanges)}
      {renderSelect("Entry Type", "entryType", options.entryTypes)}
    </div>
  );
}
