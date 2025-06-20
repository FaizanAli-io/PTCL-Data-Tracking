"use client";

import * as XLSX from "xlsx";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import PasswordGate from "@/components/PasswordGate";

type PaidOrder = {
  epi: string;
  lastMonthPaid: number;
  monthToDatePaid: number;
  monthToDateGenerated: number;
  employee: { name: string };
};

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

      const payload = rows.map((row: any) => ({
        epi: String(row["EPI"]),
        lastMonthPaid: parseInt(row["LM Paid"]),
        monthToDatePaid: parseInt(row["MTD Paid"]),
        monthToDateGenerated: parseInt(row["MTD Gen"])
      }));

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
      entry.employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PasswordGate>
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
                <th className="px-6 py-3">Last Month Paid</th>
                <th className="px-6 py-3">Month To Date Paid</th>
                <th className="px-6 py-3">Month To Date Generated</th>
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
                    <td className="px-6 py-4">{entry.employee.name}</td>
                    <td className="px-6 py-4">{entry.lastMonthPaid}</td>
                    <td className="px-6 py-4">{entry.monthToDatePaid}</td>
                    <td className="px-6 py-4">{entry.monthToDateGenerated}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PasswordGate>
  );
}
