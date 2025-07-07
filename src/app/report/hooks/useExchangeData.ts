import { useState } from "react";
import { useFilterOptions } from "./useFilterOptions";
import { ExchangeAnalytics, DateMode, FilterState } from "../types";

export const useExchangeData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExchangeAnalytics[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    role: "",
    type: "",
    region: "",
    exchange: "",
    entryType: ""
  });

  const { filterOptions, filterLoading } = useFilterOptions();

  const fetchData = async (
    mode: DateMode,
    startDate: string,
    endDate?: string,
    workingDays?: number
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/report/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          endDate,
          startDate,
          workingDays,
          role: filters.role,
          empType: filters.type,
          entType: filters.entryType
        })
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch exchange data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    filterLoading,
    filters,
    setFilters,
    filterOptions,
    fetchData
  };
};
