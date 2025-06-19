"use client";

import * as XLSX from "xlsx";

import { useEffect, useState } from "react";

type PaidOrder = {
  epi: string;
  orderCount: number;
  monthToDate: number;
  employee: {
    name: string;
  };
};

export default function OrdersPage() {
  const [data, setData] = useState<PaidOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderData = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const payload = rows.map((row: any) => ({
      epi: String(row["EPI"]),
      orderCount: parseInt(row["Order Count"]),
      monthToDate: parseInt(row["Month To Date"])
    }));

    const res = await fetch("/api/orders", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      method: "POST"
    });

    if (res.ok) {
      console.log("Upload successful");
      fetchOrderData();
      return;
    }

    console.error("Upload failed");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-white">Paid Orders</h1>
        <div>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file-upload">
            <div className="cursor-pointer bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white px-5 py-2 rounded shadow inline-block">
              Upload Data
            </div>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow-inner">
        <table className="min-w-full text-sm text-white">
          <thead className="bg-purple-800/30 text-left text-white">
            <tr>
              <th className="px-6 py-3">EPI</th>
              <th className="px-6 py-3">Employee Name</th>
              <th className="px-6 py-3">Order Count</th>
              <th className="px-6 py-3">Month To Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-white/70">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-white/70">
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((entry) => (
                <tr
                  key={entry.epi}
                  className="hover:bg-white/10 transition-colors border-t border-white/10"
                >
                  <td className="px-6 py-4">{entry.epi}</td>
                  <td className="px-6 py-4">{entry.employee.name}</td>
                  <td className="px-6 py-4">{entry.orderCount}</td>
                  <td className="px-6 py-4">{entry.monthToDate}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
