"use client";

import * as XLSX from "xlsx";
import { useState } from "react";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function DownloadDialog({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    toast.promise(
      (async () => {
        const [fsaRes, tsaRes] = await Promise.all([
          fetch(`/api/form/fsa?start=${startDate}&end=${endDate}`),
          fetch(`/api/form/tsa?start=${startDate}&end=${endDate}`)
        ]);

        if (!fsaRes.ok || !tsaRes.ok) throw new Error("Failed to fetch data");

        const fsaData = await fsaRes.json();
        const tsaData = await tsaRes.json();
        const cleanedData = [...fsaData, ...tsaData];

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(cleanedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, "Entries");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        const filename = `entries_${startDate}_to_${endDate}.xlsx`;
        saveAs(blob, filename);
      })(),
      {
        loading: "Generating Excel...",
        success: "Download started!",
        error: "Failed to download data"
      }
    );

    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="bg-zinc-900 text-white p-6 rounded-xl space-y-4 w-full max-w-md border border-white/10 shadow-lg">
          <DialogTitle className="text-xl font-semibold">Download Entries</DialogTitle>
          <div className="space-y-2">
            <div>
              <label className="text-sm block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              />
            </div>
            <div>
              <label className="text-sm block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-800 border border-white/10"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded"
            >
              Download
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
