"use client";

import { useEffect, useState } from "react";

type ReportItem = {
  epi: number;
  name: string;
  role: string;
  type: string;
  region: string;
  exchange: string;
  joinDate: string;
  entryCount: number;
};

export default function ReportPage() {
  const [data, setData] = useState<ReportItem[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [exchangeFilter, setExchangeFilter] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [filteredData, setFilteredData] = useState<ReportItem[]>([]);

  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      });
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (item) =>
          (roleFilter ? item.role === roleFilter : true) &&
          (typeFilter ? item.type === typeFilter : true) &&
          (exchangeFilter ? item.exchange === exchangeFilter : true) &&
          (regionFilter ? item.region === regionFilter : true)
      )
    );
  }, [roleFilter, typeFilter, exchangeFilter, regionFilter, data]);

  const roles = Array.from(new Set(data.map((d) => d.role)));
  const types = Array.from(new Set(data.map((d) => d.type)));
  const exchanges = Array.from(new Set(data.map((d) => d.exchange)));
  const regions = Array.from(new Set(data.map((d) => d.region)));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 text-gray-900">
      <h1 className="text-2xl font-bold mb-4 text-white">Employee Report</h1>

      <div className="flex gap-4 mb-4 flex-wrap text-white">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border rounded px-3 py-1 bg-gray-800 text-white"
        >
          <option value="">All Roles</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded px-3 py-1 bg-gray-800 text-white"
        >
          <option value="">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={exchangeFilter}
          onChange={(e) => setExchangeFilter(e.target.value)}
          className="border rounded px-3 py-1 bg-gray-800 text-white"
        >
          <option value="">All Exchanges</option>
          {exchanges.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </select>

        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="border rounded px-3 py-1 bg-gray-800 text-white"
        >
          <option value="">All Regions</option>
          {regions.map((reg) => (
            <option key={reg} value={reg}>
              {reg}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-300 text-left text-gray-900">
              <th className="py-2 px-4">EPI</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Region</th>
              <th className="py-2 px-4">Exchange</th>
              <th className="py-2 px-4">Join Date</th>
              <th className="py-2 px-4">Entry Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((emp) => (
              <tr key={emp.epi} className="border-t border-gray-300">
                <td className="py-2 px-4">{emp.epi}</td>
                <td className="py-2 px-4">{emp.name}</td>
                <td className="py-2 px-4">{emp.role}</td>
                <td className="py-2 px-4">{emp.type}</td>
                <td className="py-2 px-4">{emp.region}</td>
                <td className="py-2 px-4">{emp.exchange}</td>
                <td className="py-2 px-4">{formatDate(emp.joinDate)}</td>
                <td className="py-2 px-4">{emp.entryCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
