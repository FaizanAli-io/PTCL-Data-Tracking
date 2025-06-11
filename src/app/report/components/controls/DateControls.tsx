import { Search } from "lucide-react";
import { DateMode } from "../../types";

type DateControlsProps = {
  mode: DateMode;
  setMode: (mode: DateMode) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  workingDays: number;
  setWorkingDays: (days: number) => void;
  loading: boolean;
  onFetchData: () => void;
};

export default function DateControls({
  mode,
  setMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  workingDays,
  setWorkingDays,
  loading,
  onFetchData
}: DateControlsProps) {
  return (
    <div className="mb-6">
      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="date"
            checked={mode === "date"}
            onChange={() => setMode("date")}
            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
          />
          <span className="text-white">Single Date</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="mode"
            value="range"
            checked={mode === "range"}
            onChange={() => setMode("range")}
            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
          />
          <span className="text-white">Date Range</span>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">
            {mode === "date" ? "Select Date" : "Start Date"}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {mode === "range" && (
          <>
            <div>
              <label className="block text-sm text-slate-300 mb-2">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Working Days</label>
              <input
                type="number"
                placeholder="Enter working days"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </>
        )}

        <div className="flex items-end">
          <button
            onClick={onFetchData}
            disabled={loading}
            className="w-full px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
