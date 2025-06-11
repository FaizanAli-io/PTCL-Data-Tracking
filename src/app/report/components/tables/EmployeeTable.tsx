import { ReportItem, DateMode } from "../../types";

type EmployeeTableProps = {
  data: ReportItem[];
  totalCount: number;
  mode: DateMode;
};

export default function EmployeeTable({ data, totalCount, mode }: EmployeeTableProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-xl font-semibold text-white">Employee Data</h2>
        <p className="text-slate-300 text-sm mt-1">
          Showing {data.length} of {totalCount} employees
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">EPI</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Name</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Role</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Type</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Region</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Exchange</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Entry Count</th>
              {mode === "range" && (
                <>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Avg</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Min</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Max</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Absent</th>
                </>
              )}
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
                <td className="py-4 px-6 text-white font-medium">{emp.name}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm">
                    {emp.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      emp.type === "Full-time"
                        ? "bg-green-600/20 text-green-300"
                        : "bg-yellow-600/20 text-yellow-300"
                    }`}
                  >
                    {emp.type}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-300">{emp.region}</td>
                <td className="py-4 px-6 text-slate-300">{emp.exchange}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-semibold">
                    {emp.entryCount}
                  </span>
                </td>
                {mode === "range" && (
                  <>
                    <td className="py-4 px-6 text-white">{emp.avg?.toFixed(1)}</td>
                    <td className="py-4 px-6 text-white">{emp.min}</td>
                    <td className="py-4 px-6 text-white">{emp.max}</td>
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
                  </>
                )}
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
