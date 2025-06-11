"use client";
import { useState } from "react";

export default function NearestNetworkPage() {
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [results, setResults] = useState([]);

  const fetchNearest = async () => {
    const res = await fetch("/api/network", {
      method: "POST",
      body: JSON.stringify({ lat, lng }),
      headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    console.log(data);
    setResults(data);
  };

  return (
    <div className="p-6 space-y-4 text-white">
      <h2 className="text-2xl font-bold">Find Nearest Network Entries</h2>
      <div className="flex gap-4">
        <input
          type="number"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Longitude"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded"
        />
        <button
          onClick={fetchNearest}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </div>

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {results.map((entry: any, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded shadow">
              <p className="text-lg font-semibold">{entry.name}</p>
              <p className="text-sm text-gray-400">Distance: {entry.distance.toFixed(2)} km</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
