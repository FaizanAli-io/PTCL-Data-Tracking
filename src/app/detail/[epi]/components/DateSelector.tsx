import { Calendar, Search, Loader2 } from "lucide-react";

interface DateSelectorProps {
  date: string;
  onDateChange: (date: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export const DateSelector = ({ date, onDateChange, onSearch, isLoading }: DateSelectorProps) => (
  <div className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 shadow-2xl">
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <div className="flex items-center gap-2 text-purple-200 font-medium">
        <Calendar className="w-5 h-5" />
        Select Date:
      </div>

      <div className="relative flex-1 max-w-xs">
        <input
          type="date"
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
          className="w-full px-4 py-3 bg-purple-800/30 border border-purple-500/40 rounded-xl text-purple-100 placeholder-purple-300/60 focus:outline-none focus:border-purple-400 focus:bg-purple-800/40 transition-all duration-300"
        />
      </div>

      <button
        onClick={onSearch}
        disabled={isLoading || !date}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        {isLoading ? "Loading..." : "Load Entries"}
      </button>
    </div>
  </div>
);
