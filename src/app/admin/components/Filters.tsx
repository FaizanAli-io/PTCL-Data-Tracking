"use client";

import { useEffect, useState } from "react";

type OptionSet = {
  roles: string[];
  types: string[];
  regions: string[];
  exchanges: string[];
};

export default function Filters({
  onFilterChange
}: {
  onFilterChange: (filters: Record<string, string>) => void;
}) {
  const [options, setOptions] = useState<OptionSet>({
    roles: [],
    types: [],
    regions: [],
    exchanges: []
  });

  const [filters, setFilters] = useState<Record<string, string>>({
    role: "",
    type: "",
    region: "",
    exchange: ""
  });

  useEffect(() => {
    fetch("/api/report/enum-values")
      .then((res) => res.json())
      .then((json) => setOptions(json.data))
      .catch(() => setOptions({ roles: [], types: [], regions: [], exchanges: [] }));
  }, []);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <select
        value={filters.role}
        onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
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
        onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
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
        onChange={(e) => setFilters((f) => ({ ...f, region: e.target.value }))}
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
        onChange={(e) => setFilters((f) => ({ ...f, exchange: e.target.value }))}
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
