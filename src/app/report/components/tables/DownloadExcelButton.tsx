"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { toast } from "react-hot-toast";

type DownloadExcelButtonProps<T extends Record<string, any>> = {
  data: T[];
  filename?: string;
  sheetName?: string;
  className?: string;
};

export default function DownloadExcelButton<T extends Record<string, any>>({
  data,
  filename = "data.xlsx",
  sheetName = "Sheet1",
  className = ""
}: DownloadExcelButtonProps<T>) {
  const handleDownload = () => {
    if (data.length === 0) {
      toast.error("No data to download");
      return;
    }

    toast.promise(
      (async () => {
        const cleanedData = data.map((row) => {
          const newRow: Record<string, any> = {};
          for (const [key, value] of Object.entries(row)) {
            newRow[key] =
              typeof value === "number"
                ? value
                : typeof value === "string"
                ? value
                : JSON.stringify(value);
          }
          return newRow;
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(cleanedData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array"
        });

        const blob = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        });

        saveAs(blob, filename);
      })(),
      {
        loading: "Generating Excel...",
        success: "Download started!",
        error: "Failed to generate file"
      }
    );
  };

  return (
    <button
      onClick={handleDownload}
      className={`inline-flex items-center px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-sm font-medium rounded transition ${className}`}
    >
      Download as Excel
    </button>
  );
}
