import Link from "next/link";

import DownloadExcelButton from "./DownloadExcelButton";
import { EmployeeAnalytics, DateMode } from "../../types";

type EmployeeTableProps = {
  data: EmployeeAnalytics[];
  totalCount: number;
  mode: DateMode;
};

const badgeColors: Record<string, string> = {
  MGT: "bg-black text-white",
  FSA: "bg-blue-600 text-white",
  TSA: "bg-pink-500 text-white",
  FFO: "bg-purple-600 text-white",
  OSP: "bg-orange-500 text-white",
  REG: "bg-green-800 text-white"
};

export default function EmployeeTable({ data, totalCount, mode }: EmployeeTableProps) {
  const rangeInput = ["mtd", "ytd", "custom-range"].includes(mode);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Employee Data</h2>
          <p className="text-slate-300 text-sm mt-1">
            Showing {data.length} of {totalCount} employees
          </p>
        </div>

        <DownloadExcelButton
          data={data}
          filename="employee_data.xlsx"
          sheetName="Employees"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-sm md:text-base"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">EPI</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Name</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">DDS Count</th>
              {rangeInput && (
                <>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Missing</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Min</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Avg</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Max</th>
                </>
              )}
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">MTD Orders Paid</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">
                MTD Orders Generated
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">
                Orders Paid Last Month
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Role</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Type</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Exchange</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Region</th>
            </tr>
          </thead>
          <tbody>
            {data.map((emp, index) => (
              <tr
                key={emp.epi}
                className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                  index % 2 === 0 ? "bg-white/2" : ""
                }`}
              >
                <td className="py-4 px-6 text-white font-mono">{emp.epi}</td>
                <td className="py-4 px-6 text-white font-medium">
                  <Link href={`/detail/${emp.epi}`} className="hover:underline text-emerald-300">
                    {emp.name}
                  </Link>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-semibold">
                    {emp.entryCount}
                  </span>
                </td>
                {rangeInput && (
                  <>
                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          (emp.absent || 0) > 0
                            ? "bg-red-600/20 text-red-300"
                            : "bg-green-600/20 text-green-300"
                        }`}
                      >
                        {emp.absent || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-white">{emp.min}</td>
                    <td className="py-4 px-6 text-white">{emp.avg?.toFixed(0)}</td>
                    <td className="py-4 px-6 text-white">{emp.max}</td>
                  </>
                )}
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-green-600/40 text-purple-300 rounded-full text-sm font-semibold">
                    {emp.ordersInfo.monthToDatePaid}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-yellow-600/40 text-purple-300 rounded-full text-sm font-semibold">
                    {emp.ordersInfo.monthToDateGenerated}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-blue-600/40 text-purple-300 rounded-full text-sm font-semibold">
                    {emp.ordersInfo.lastMonthPaid}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-sm ${badgeColors[emp.role]}`}>
                    {emp.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-sm ${badgeColors[emp.type]}`}>
                    {emp.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-300">{emp.exchange}</td>
                <td className="py-4 px-6 text-slate-300">{emp.region}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">No data found</div>
            <p className="text-slate-500">Try adjusting your filters or generate a new report</p>
          </div>
        )}
      </div>
    </div>
  );
}
