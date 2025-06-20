import DownloadExcelButton from "./DownloadExcelButton";
import { ExchangeAnalytics, DateMode } from "../../types";

type ExchangeTableProps = {
  data: ExchangeAnalytics[];
  totalCount: number;
  mode: DateMode;
};

export default function ExchangeTable({ data, totalCount, mode }: ExchangeTableProps) {
  const rangeInput = ["mtd", "ytd", "custom-range"].includes(mode);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      <div className="p-6 border-b border-white/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Exchange Analytics</h2>
          <p className="text-slate-300 text-sm mt-1">
            Showing {data.length} of {totalCount} exchanges
          </p>
        </div>

        <DownloadExcelButton
          data={data}
          filename="exchange_analytics.xlsx"
          sheetName="Exchanges"
          className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold text-sm md:text-base"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Exchange</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Headcount</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">
                Missing {rangeInput ? " Days" : " People"}
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Min</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Avg</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Max</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Efficiency</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">MTD Orders Paid</th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">
                MTD Orders Generated
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">
                Orders Paid Last Month
              </th>
              <th className="text-left py-4 px-6 text-slate-300 font-semibold">Region</th>
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
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-black text-purple-300 rounded-full text-sm font-semibold">
                    {exchange.headCount}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      exchange.missing > 0
                        ? "bg-red-600/20 text-red-300"
                        : "bg-green-600/20 text-green-300"
                    }`}
                  >
                    {exchange.missing.toFixed(0)}
                  </span>
                </td>
                <td className="py-4 px-6 text-white">{exchange.min.toFixed(0)}</td>
                <td className="py-4 px-6 text-white">{exchange.avg.toFixed(0)}</td>
                <td className="py-4 px-6 text-white">{exchange.max.toFixed(0)}</td>
                <td
                  className={`py-4 px-6 font-bold text-${
                    exchange.efficiency < 5
                      ? "red-500"
                      : exchange.efficiency < 10
                      ? "yellow-400"
                      : "green-400"
                  }`}
                >
                  {exchange.efficiency.toFixed(1)}
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-green-600/40 text-purple-300 rounded-full text-sm font-semibold">
                    {exchange.ordersInfo.monthToDatePaid}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-yellow-600/40 text-purple-300 rounded-full text-sm font-semibold">
                    {exchange.ordersInfo.monthToDateGenerated}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="px-2 py-1 bg-blue-600/40 text-purple-300 rounded-full text-sm font-semibold">
                    {exchange.ordersInfo.lastMonthPaid}
                  </span>
                </td>
                <td className="py-4 px-6 text-white">{exchange.region}</td>
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
