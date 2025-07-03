import Link from "next/link";
import { useState, useMemo } from "react";
import DownloadExcelButton from "./DownloadExcelButton";

export interface ColumnConfig<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  showWhen?: (row?: T) => boolean; // optional; accepts row or undefined
  render?: (row: T) => React.ReactNode;
  link?: (row: T) => string | undefined;
  bgColor?: (row: T) => string | undefined;
}

interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: ColumnConfig<T>[];
  totalCount?: number;
  title?: string;
  filename?: string;
  sheetName?: string;
}

const CellContent = ({
  value,
  bgColor,
  link
}: {
  value: React.ReactNode;
  bgColor?: string;
  link?: string;
}) => {
  const content = link ? (
    <Link href={link} className="hover:underline text-emerald-300">
      {value}
    </Link>
  ) : (
    value
  );

  return (
    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${bgColor || ""}`}>
      {content}
    </span>
  );
};

export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  totalCount,
  title,
  filename,
  sheetName
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  const handleHeaderClick = (column: keyof T, sortable?: boolean) => {
    if (!sortable) return;
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
      if (sortDirection === null) setSortColumn(null);
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => !col.showWhen || col.showWhen());
  }, [columns]);

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      {title && totalCount !== undefined && (
        <div className="p-6 border-b border-white/20 flex justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-slate-300 text-sm mt-1">
              Showing {data.length} of {totalCount}
            </p>
          </div>
          {filename && (
            <DownloadExcelButton
              data={sortedData}
              filename={filename}
              sheetName={sheetName}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-sm md:text-base"
            />
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key as string}
                  className="text-left py-4 px-6 text-slate-300 font-semibold cursor-pointer select-none"
                  onClick={() => handleHeaderClick(col.key, col.sortable)}
                >
                  {col.label}
                  {sortColumn === col.key && sortDirection === "asc" && " ▲"}
                  {sortColumn === col.key && sortDirection === "desc" && " ▼"}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length} className="text-center text-slate-400 p-8">
                  No data found
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-t border-white/10 hover:bg-white/5 ${
                    index % 2 === 0 ? "bg-white/2" : ""
                  }`}
                >
                  {visibleColumns.map((col) => {
                    if (col.showWhen && !col.showWhen(row)) return null;
                    return (
                      <td key={col.key as string} className="py-4 px-6">
                        <CellContent
                          value={col.render ? col.render(row) : String(row[col.key] ?? 0)}
                          bgColor={col.bgColor?.(row)}
                          link={col.link?.(row)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
