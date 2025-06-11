import { ExchangeAnalytics } from "../../types";

type ExchangeTableProps = {
  data: ExchangeAnalytics[];
  totalCount: number;
};

export default function ExchangeTable({ data, totalCount }: ExchangeTableProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20">
        <h2 className="text-xl font-semibold text-white">Exchange Analytics</h2>
        <p className="text-slate-300 text-sm mt-1">
          Showing {data.length} of {totalCount} exchanges
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Exchange</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Total Employees</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Avg Entry Count</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Total Entries</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">
                Performance Score
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Top Performer</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Regions</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Total Absent</th>
            </tr>
          </thead>
          <tbody>
            {data.map((exchange, index) => (
              <tr
                key={exchange.exchange}
                className={`border-t border-white/10 hover:bg-white/5 transition-colors ${
                  index % 2 === 0 ? "bg-white/2" : ""
                }`}
              >
                <td className="py-4 px-6">
                  <span className="px-3 py-1 bg-purple-600/20 text-purple-300 rounded-full text-sm font-semibold">
                    {exchange.exchange}
                  </span>
                </td>
                <td className="py-4 px-6 text-white font-medium">{exchange.totalEmployees}</td>
                <td className="py-4 px-6 text-white">{exchange.avgEntryCount.toFixed(1)}</td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded-full text-sm font-semibold">
                    {exchange.totalEntries}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                        style={{ width: `${Math.min(100, (exchange.avgPerformance / 10) * 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-white text-sm">{exchange.avgPerformance.toFixed(1)}</span>
                  </div>
                </td>
                <td className="py-4 px-6 text-slate-300">{exchange.topPerformer}</td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1">
                    {exchange.regions.map((region) => (
                      <span
                        key={region}
                        className="px-2 py-1 bg-cyan-600/20 text-cyan-300 rounded-full text-xs"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      exchange.totalAbsent > 0
                        ? "bg-red-600/20 text-red-300"
                        : "bg-green-600/20 text-green-300"
                    }`}
                  >
                    {exchange.totalAbsent}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 text-lg mb-2">No exchange data found</div>
            <p className="text-slate-500">Try adjusting your filters or generate a new report</p>
          </div>
        )}
      </div>
    </div>
  );
}
