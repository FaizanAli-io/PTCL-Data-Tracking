"use client";

import { useEffect, useState } from "react";

interface Network {
  id: number;
  latitude: number;
  longitude: number;
  FDH: string;
  FAT: string;
}

export default function NetworkData() {
  const [data, setData] = useState<Network[]>([]);

  useEffect(() => {
    fetch("/api/network")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Network Data</h1>
      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Latitude</th>
              <th className="px-3 py-2">Longitude</th>
              <th className="px-3 py-2">FDH</th>
              <th className="px-3 py-2">FAT</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b even:bg-gray-50">
                  <td className="px-3 py-2">{row.id}</td>
                  <td className="px-3 py-2">{row.latitude}</td>
                  <td className="px-3 py-2">{row.longitude}</td>
                  <td className="px-3 py-2">{row.FDH}</td>
                  <td className="px-3 py-2">{row.FAT}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
