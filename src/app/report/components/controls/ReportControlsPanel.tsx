import { Filter } from "lucide-react";
import DateControls from "./DateControls";
import FilterControls from "./FilterControls";
import { DateMode, FilterState } from "../../types";

type ReportControlsPanelProps = {
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
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filterOptions: {
    roles: string[];
    types: string[];
    regions: string[];
    exchanges: string[];
  };
  autoRefresh: boolean;
  timeLeft: number;
};

export default function ReportControlsPanel({
  mode,
  setMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  workingDays,
  setWorkingDays,
  loading,
  onFetchData,
  filters,
  setFilters,
  filterOptions
}: ReportControlsPanelProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8 space-y-6">
      <h2 className="text-xl font-semibold text-white flex items-center gap-2">
        <Filter className="w-5 h-5" />
        Report Configuration
      </h2>

      <div className="grid gap-6">
        <DateControls
          mode={mode}
          setMode={setMode}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          workingDays={workingDays}
          setWorkingDays={setWorkingDays}
          loading={loading}
          onFetchData={onFetchData}
        />

        <FilterControls filters={filters} setFilters={setFilters} options={filterOptions} />

        <button
          onClick={onFetchData}
          disabled={loading}
          className="px-8 py-3 mt-4 text-lg rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-200 shadow-lg"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>
    </div>
  );
}
