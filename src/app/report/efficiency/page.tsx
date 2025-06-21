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
    } finally {
      setLoading(false);
    }
  };

  const bucketRanges: string[] = [];
  for (let i = 0; i <= maxValue; i += classInterval) {
    i + classInterval > maxValue
      ? bucketRanges.push(`${i}+`)
      : bucketRanges.push(`${i}-${i + classInterval - 1}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-slate-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <main className="relative z-10 p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
            Efficiency Report
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full shadow-lg shadow-purple-500/50"></div>
        </div>

        {/* Controls Panel */}
        <div className="bg-gradient-to-br from-purple-900/80 via-slate-800/80 to-purple-800/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-purple-500/30 relative overflow-hidden">
          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-3xl"></div>
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 backdrop-blur-sm p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300"
            >
              <option value="">All Roles</option>
              {roles.map((r) => (
                <option key={r} value={r} className="bg-purple-900">
                  {r}
                </option>
              ))}
            </select>

            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 backdrop-blur-sm p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300"
            >
              <option value="">All Types</option>
              {types.map((t) => (
                <option key={t} value={t} className="bg-purple-900">
                  {t}
                </option>
              ))}
            </select>

            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as any)}
              className="bg-gradient-to-br from-purple-800/80 to-slate-700/80 backdrop-blur-sm p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300"
            >
              <option value="currentPaid" className="bg-purple-900">
                Current Paid
              </option>
              <option value="currentGenerated" className="bg-purple-900">
                Current Generated
              </option>
              <option value="previous" className="bg-purple-900">
                Previous
              </option>
            </select>

            <div className="relative">
              <input
                type="number"
                value={classInterval}
                onChange={(e) => setClassInterval(Number(e.target.value))}
                placeholder="Class Interval"
                className="w-full bg-gradient-to-br from-purple-800/80 to-slate-700/80 backdrop-blur-sm p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 placeholder-purple-300/50"
              />
              <label className="absolute -top-2 left-3 bg-gradient-to-r from-purple-400 to-pink-400 text-xs px-2 py-0.5 rounded-full text-white font-medium">
                Interval
              </label>
            </div>

            <div className="relative">
              <input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(Number(e.target.value))}
                placeholder="Max Value"
                className="w-full bg-gradient-to-br from-purple-800/80 to-slate-700/80 backdrop-blur-sm p-3 rounded-xl text-white border border-purple-400/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 transition-all duration-300 placeholder-purple-300/50"
              />
              <label className="absolute -top-2 left-3 bg-gradient-to-r from-purple-400 to-pink-400 text-xs px-2 py-0.5 rounded-full text-white font-medium">
                Max Value
              </label>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:via-pink-500 hover:to-indigo-500 px-6 py-3 rounded-xl text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  "Generate Report"
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Results Table */}
        {data.length > 0 && (
          <div className="bg-gradient-to-br from-purple-900/60 via-slate-800/60 to-purple-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden relative">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl"></div>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>

            <div className="relative z-10 overflow-x-auto">
              <table className="min-w-full text-left text-white">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm">
                    <th className="p-4 font-semibold text-purple-200 border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        Region
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-purple-200 border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        Exchange
                      </div>
                    </th>
                    <th className="p-4 font-semibold text-purple-200 border-b border-purple-500/30">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        Headcount
                      </div>
                    </th>
                    {bucketRanges.map((label, idx) => (
                      <th
                        key={label}
                        className="p-4 font-semibold text-purple-200 border-b border-purple-500/30"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              idx % 3 === 0
                                ? "bg-violet-400"
                                : idx % 3 === 1
                                ? "bg-purple-400"
                                : "bg-pink-400"
                            }`}
                          ></div>
                          {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-purple-800/30 transition-all duration-300 group"
                    >
                      <td className="p-4 border-b border-purple-500/20 font-medium text-purple-100">
                        {row.region}
                      </td>
                      <td className="p-4 border-b border-purple-500/20 text-purple-200">
                        {row.exchange}
                      </td>
                      <td className="p-4 border-b border-purple-500/20">
                        <span className="bg-gradient-to-r from-purple-600/50 to-pink-600/50 px-3 py-1 rounded-full text-sm font-semibold">
                          {row.headcount}
                        </span>
                      </td>
                      {bucketRanges.map((label) => {
                        const bucketStart = label.split("-")[0].replace("+", "");
                        const value = row.buckets[bucketStart] || 0;

                        const proportion = row.headcount > 0 ? value / row.headcount : 0;
                        const intensity = Math.min(500, proportion * 500);
                        const clamped = Math.max(0, intensity);

                        const lightness = 90 - (clamped / 500) * 50;
                        const color = `hsl(0, 100%, ${lightness}%)`;

                        return (
                          <td key={label} className="p-2 border-b border-purple-500/20 text-center">
                            <span
                              className="inline-block w-8 h-8 leading-8 rounded-full font-bold text-black"
                              style={{ backgroundColor: color }}
                            >
                              {value}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-purple-300/70 text-sm">
            Powered by Advanced Analytics • Real-time Data Processing
          </p>
        </div>
      </main>
    </div>
  );
}
