"use client";

import * as XLSX from "xlsx";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { OrderData, orderFields } from "@/types/types";
import PermissionGate from "@/components/PermissionGate";

type PaidOrder = {
  epi: string;
  name: string;
} & OrderData;

export default function OrdersPage() {
  const [data, setData] = useState<PaidOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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

    const toastId = toast.loading("Uploading file...");
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      const payload = rows.map((row: any) => {
        const entry: Record<string, any> = { epi: String(row["epi"]) };
        for (const key of orderFields) {
          entry[key] = parseInt(row[key]) || 0;
        }
        return entry;
      });

      const res = await fetch("/api/orders", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        method: "POST"
      });

      if (res.ok) {
        toast.success("Upload successful", { id: toastId });
        fetchOrderData();
      } else {
        toast.error("Upload failed", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
      console.error(error);
    }
  };

  const filteredData = data.filter(
    (entry) =>
      entry.epi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PermissionGate minLevel={3}>
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

        <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md overflow-x-auto">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold whitespace-nowrap">Excel Columns:</span>
            <div className="flex-1 text-xs text-white/80 whitespace-nowrap overflow-hidden text-ellipsis">
              {"epi, " + orderFields.join(", ")}
            </div>
            <button
              onClick={() => {
                const tabSeparated = ["epi", ...orderFields].join("\t");
                navigator.clipboard.writeText(tabSeparated);
              }}
              className="text-xs bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded shrink-0"
            >
              Copy Excel Columns
            </button>
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Search by EPI or Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded px-4 py-2 bg-white/10 text-white placeholder-white/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow-inner">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-purple-800/30 text-left text-white">
              <tr>
                <th className="px-6 py-3">EPI</th>
                <th className="px-6 py-3">Employee Name</th>
                {orderFields.map((field) => (
                  <th key={field} className="px-6 py-3 capitalize">
                    {field.replace(/([A-Z])/g, " $1")}
                  </th>
                ))}
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
                filteredData.map((entry) => (
                  <tr
                    key={entry.epi}
                    className="hover:bg-white/10 transition-colors border-t border-white/10"
                  >
                    <td className="px-6 py-4">{entry.epi}</td>
                    <td className="px-6 py-4">{entry.name}</td>
                    {orderFields.map((field) => (
                      <td key={field} className="px-6 py-4">
                        {entry[field as keyof PaidOrder] ?? 0}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PermissionGate>
  );
}
