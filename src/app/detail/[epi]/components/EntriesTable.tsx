import { EmployeeEntry } from "../types/employee";
import { formatDateTime } from "../utils/dateUtils";
import { Phone, MapPin, Clock, DollarSign } from "lucide-react";

interface EntriesTableProps {
  entries: EmployeeEntry[];
  date: string;
}

export const EntriesTable = ({ entries, date }: EntriesTableProps) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  if (entries.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-12 text-center shadow-2xl">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-purple-300" />
          </div>
          <h3 className="text-xl font-semibold text-purple-100">No Entries Found</h3>
          <p className="text-purple-200/70">
            No customer visits were recorded for {formattedDate}. The employee may not have made any
            visits on this date.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-100 mb-2">
          Customer Visits - {formattedDate}
        </h2>
        <p className="text-purple-200/70">
          {entries.length} customer visit{entries.length !== 1 ? "s" : ""} recorded
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto rounded-xl border border-purple-500/30">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-purple-800/50 backdrop-blur-sm border-b border-purple-500/30">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Time</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Contact</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Address</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">
                  Current Provider
                </th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Price (Rs)</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Reason</th>
                <th className="px-4 py-3 text-left font-semibold text-purple-200">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-purple-500/20 hover:bg-purple-800/30 transition-colors duration-200"
                >
                  <td className="px-4 py-3 text-purple-100 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-400" />
                      {formatDateTime(entry.createdAt)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-purple-100 max-w-xs">
                    <div className="truncate font-medium">{entry.type || "-"}</div>
                  </td>
                  <td className="px-4 py-3 text-purple-100 max-w-xs">
                    <div className="truncate font-medium">{entry.customerName}</div>
                  </td>
                  <td className="px-4 py-3 text-purple-100">
                    <div className="space-y-1">
                      {entry.customerMobile && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-purple-400" />
                          <span className="text-xs">{entry.customerMobile}</span>
                        </div>
                      )}
                      {entry.customerPSTN && (
                        <div className="text-xs text-purple-300/70">{entry.customerPSTN}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-purple-100 max-w-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <span className="text-xs leading-relaxed">{entry.customerAddress}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-purple-100">
                    {entry.currentInternetProvider || "-"}
                  </td>
                  <td className="px-4 py-3 text-purple-100">
                    {entry.currentInternetPrice ? (
                      <div className="flex items-center gap-1">{entry.currentInternetPrice}</div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-purple-100 max-w-xs">
                    <div className="truncate">{entry.reason || "-"}</div>
                  </td>
                  <td className="px-4 py-3 text-purple-100 max-w-xs">
                    <div className="truncate">{entry.remarks || "-"}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
