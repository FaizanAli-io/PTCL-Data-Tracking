"use client";

import { useEffect, useState } from "react";
import PermissionGate from "@/components/PermissionGate";

interface PermissionEntry {
  epi: string;
  name: string;
  level: number;
  pass: string;
}

export default function PermissionsPage() {
  const [data, setData] = useState<PermissionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth");
        const json = await res.json();
        if (res.ok) {
          setData(json.data.sort((a: PermissionEntry, b: PermissionEntry) => b.level - a.level));
        } else {
          setError(json.message || "Failed to load data.");
        }
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PermissionGate minLevel={4}>
      <div className="min-h-screen bg-gray-950 text-white p-6">
        <h1 className="text-2xl font-bold mb-6">All Permissions</h1>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="border border-gray-700 px-4 py-2 text-left">EPI</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Name</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Level</th>
                  <th className="border border-gray-700 px-4 py-2 text-left">Password</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => (
                  <tr key={entry.epi} className="hover:bg-gray-800 transition">
                    <td className="border border-gray-700 px-4 py-2 font-mono">{entry.epi}</td>
                    <td className="border border-gray-700 px-4 py-2">{entry.name}</td>
                    <td className="border border-gray-700 px-4 py-2">{entry.level}</td>
                    <td className="border border-gray-700 px-4 py-2 font-mono">{entry.pass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}
