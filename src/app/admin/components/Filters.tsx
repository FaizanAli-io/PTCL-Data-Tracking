"use client";

import { useEffect } from "react";

export default function Filters({
  options,
  filters,
  setFilters,
  onFilterChange
}: {
  options: Record<string, string[]>;
  filters: Record<string, string>;
  setFilters: (filters: Record<string, string>) => void;
  onFilterChange: (filters: Record<string, string>) => void;
}) {
  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <select
        value={filters.role}
        onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        className="bg-zinc-900 text-white border border-white/20 rounded px-3 py-2"
      >
        <option value="">All Roles</option>
        {options.roles.map((role) => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>

      <select
        value={filters.type}
        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        className="bg-zinc-900 text-white border border-white/20 rounded px-3 py-2"
      >
        <option value="">All Types</option>
        {options.types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <select
        value={filters.region}
        onChange={(e) => setFilters({ ...filters, region: e.target.value })}
        className="bg-zinc-900 text-white border border-white/20 rounded px-3 py-2"
      >
        <option value="">All Regions</option>
        {options.regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>

      <select
        value={filters.exchange}
        onChange={(e) => setFilters({ ...filters, exchange: e.target.value })}
        className="bg-zinc-900 text-white border border-white/20 rounded px-3 py-2"
      >
        <option value="">All Exchanges</option>
        {options.exchanges.map((ex) => (
          <option key={ex} value={ex}>
            {ex}
          </option>
        ))}
      </select>
    </div>
  );
}
