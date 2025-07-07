import { useEffect } from "react";
import { DateMode } from "../../types";

const rangeInputs = ["mtd", "ytd", "custom-range"];

type DateControlsProps = {
  mode: DateMode;
  setMode: (mode: DateMode) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  workingDays: number;
  setWorkingDays: (days: number) => void;
};

export default function DateControls({
  mode,
  setMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  workingDays,
  setWorkingDays
}: DateControlsProps) {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";

    return `${day}${suffix} ${month} ${year}`;
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const formatForInput = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    if (mode === "custom-date" || mode === "custom-range") return;

    let newStartDate = "";
    let newEndDate = "";

    switch (mode) {
      case "yesterday":
        newStartDate = formatForInput(yesterday);
        newEndDate = newStartDate;
        break;
      case "today":
        newStartDate = formatForInput(today);
        newEndDate = newStartDate;
        break;
      case "mtd":
        newStartDate = formatForInput(firstDayOfMonth);
        newEndDate = formatForInput(today);
        break;
      case "ytd":
        newStartDate = formatForInput(firstDayOfYear);
        newEndDate = formatForInput(today);
        break;
    }

    setEndDate(newEndDate);
    setStartDate(newStartDate);
    calculateWorkingDays(newStartDate, newEndDate);
  }, [mode]);

  const calculateWorkingDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let count = 0;

    const current = new Date(startDate);
    while (current <= endDate) {
      if (current.getDay() !== 0) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    setWorkingDays(count);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4">
        {(["yesterday", "today", "mtd", "ytd", "custom-date", "custom-range"] as DateMode[]).map(
          (option) => (
            <label key={option} className="flex items-center gap-4 cursor-pointer">
              <input
                type="radio"
                name="mode"
                value={option}
                checked={mode === option}
                onChange={() => setMode(option)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <span className="text-white capitalize">
                {option === "mtd"
                  ? "MTD"
                  : option === "ytd"
                  ? "YTD"
                  : option === "custom-date"
                  ? "Custom Date"
                  : option === "custom-range"
                  ? "Custom Range"
                  : option.replace("-", " ")}
              </span>
            </label>
          )
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-slate-300 mb-2">Start Date</label>
          {["custom-date", "custom-range"].includes(mode) ? (
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (mode === "custom-range") {
                  calculateWorkingDays(e.target.value, endDate);
                }
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          ) : (
            <div className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white">
              {formatDate(startDate)}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">
            {mode === "custom-range" ? "End Date" : "Date"}
          </label>
          {mode === "custom-range" ? (
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                calculateWorkingDays(startDate, e.target.value);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          ) : (
            <div className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white">
              {rangeInputs.includes(mode) ? formatDate(endDate) : "N / A"}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm text-slate-300 mb-2">Working Days</label>
          {rangeInputs.includes(mode) ? (
            <input
              type="number"
              placeholder="Enter working days"
              value={workingDays}
              onChange={(e) => setWorkingDays(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          ) : (
            <div className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white">
              {mode === "custom-date" ? 1 : workingDays}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
