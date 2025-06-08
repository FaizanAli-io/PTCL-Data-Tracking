"use client";

import { useState, useEffect } from "react";

interface TSA {
  id: number;
  epi: number;
  tsaName: string;
  callerExchange: string;
  customerName: string;
  customerMobile: string;
  customerAddress: string;
  customerExchange: string;
  dialingRemarks: string;
  createdAt: string;
}

export default function TsaData() {
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [data, setData] = useState<TSA[]>([]);

  const fetchData = async () => {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);
    const res = await fetch(`/api/tsa?${params.toString()}`);
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-gray-900">TSA Data</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchData();
        }}
        className="mb-6 flex gap-4 items-end"
      >
        <div>
          <label className="block font-semibold text-gray-900 mb-1" htmlFor="from">
            From
          </label>
          <input
            id="from"
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="border p-2 rounded text-gray-900"
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-900 mb-1" htmlFor="to">
            To
          </label>
          <input
            id="to"
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="border p-2 rounded text-gray-900"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Filter
        </button>
      </form>

      <div className="overflow-auto max-h-[600px] border rounded">
        <table className="min-w-full text-left text-sm text-gray-700">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">EPI</th>
              <th className="px-3 py-2">TSA Name</th>
              <th className="px-3 py-2">Caller Exchange</th>
              <th className="px-3 py-2">Customer Name</th>
              <th className="px-3 py-2">Customer Mobile</th>
              <th className="px-3 py-2">Customer Address</th>
              <th className="px-3 py-2">Customer Exchange</th>
              <th className="px-3 py-2">Dialing Remarks</th>
              <th className="px-3 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center p-4 text-gray-500">
                  No records found
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="border-b even:bg-gray-50">
                  <td className="px-3 py-1">{row.id}</td>
                  <td className="px-3 py-1">{row.epi}</td>
                  <td className="px-3 py-1">{row.tsaName}</td>
                  <td className="px-3 py-1">{row.callerExchange.replace(/_/g, " ")}</td>
                  <td className="px-3 py-1">{row.customerName}</td>
                  <td className="px-3 py-1">{row.customerMobile}</td>
                  <td className="px-3 py-1">{row.customerAddress}</td>
                  <td className="px-3 py-1">{row.customerExchange.replace(/_/g, " ")}</td>
                  <td className="px-3 py-1">{row.dialingRemarks.replace(/_/g, " ")}</td>
                  <td className="px-3 py-1">{new Date(row.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
