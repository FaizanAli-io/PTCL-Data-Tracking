"use client";

import { useEffect, useState } from "react";

type EfficiencyData = {
  region: string;
  exchange: string;
  headcount: number;
  buckets: Record<string, number>;
};

export default function EfficiencyReportPage() {
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [orderType, setOrderType] = useState<"currentPaid" | "currentGenerated" | "previous">(
    "currentPaid"
  );
  const [data, setData] = useState<EfficiencyData[]>([]);
  const [classInterval, setClassInterval] = useState(2);
  const [loading, setLoading] = useState(false);
  const [maxValue, setMaxValue] = useState(10);

  useEffect(() => {
    fetch("/api/enum-values")
      .then((res) => res.json())
      .then((res) => res.data)
      .then((data) => {
        setRoles(data.roles.filter((r: string) => r !== "MGT"));
        setTypes(data.types.filter((r: string) => r !== "MGT"));
      })
      .catch((err) => console.error(err));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report/efficiency", {
        method: "POST",
        body: JSON.stringify({ role, type, orderType, classInterval, maxValue })
      });
      const result = await res.json();
      setData(result);
      console.log(result);
      console.log(data);
    } finally {
      setLoading(false);
    }
  };

  const bucketRanges: string[] = [];
  for (let i = 0; i <= maxValue; i += classInterval) {
    i + classInterval > maxValue
      ? bucketRanges.push(`${i}+`)
      : bucketRanges.push(`${i}-${i + classInterval}`);
  }

  return (
    <main className="min-h-screen bg-zinc-900 text-white p-8 space-y-6">
      <h1 className="text-4xl font-bold text-center mb-8">Efficiency Report</h1>

      <div className="bg-zinc-800 p-6 rounded-xl space-y-4 shadow-lg border border-zinc-700">
        <div className="flex flex-wrap gap-4">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-zinc-700 p-2 rounded text-white"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-zinc-700 p-2 rounded text-white"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <select
            value={orderType}
            onChange={(e) => setOrderType(e.target.value as any)}
            className="bg-zinc-700 p-2 rounded text-white"
          >
            <option value="currentPaid">Current Paid</option>
            <option value="currentGenerated">Current Generated</option>
            <option value="previous">Previous</option>
          </select>

          <input
            type="number"
            value={classInterval}
            onChange={(e) => setClassInterval(Number(e.target.value))}
            placeholder="Class Interval"
            className="bg-zinc-700 p-2 rounded text-white w-32"
          />

          <input
            type="number"
            value={maxValue}
            onChange={(e) => setMaxValue(Number(e.target.value))}
            placeholder="Max Value"
            className="bg-zinc-700 p-2 rounded text-white w-32"
          />

          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white font-medium"
          >
            {loading ? "Loading..." : "Generate Report"}
          </button>
        </div>
      </div>

      {data.length > 0 && (
        <div className="overflow-x-auto mt-8">
          <table className="min-w-full border border-zinc-700 text-left text-white">
            <thead className="bg-zinc-800">
              <tr>
                <th className="p-3 border-b border-zinc-700">Region</th>
                <th className="p-3 border-b border-zinc-700">Exchange</th>
                <th className="p-3 border-b border-zinc-700">Headcount</th>
                {bucketRanges.map((label) => (
                  <th key={label} className="p-3 border-b border-zinc-700">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-800">
                  <td className="p-3 border-b border-zinc-700">{row.region}</td>
                  <td className="p-3 border-b border-zinc-700">{row.exchange}</td>
                  <td className="p-3 border-b border-zinc-700">{row.headcount}</td>
                  {bucketRanges.map((label) => {
                    const bucketStart = label.split("-")[0].replace("+", "");
                    const value = row.buckets[bucketStart] || 0;
                    return (
                      <td key={label} className="p-3 border-b border-zinc-700">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
