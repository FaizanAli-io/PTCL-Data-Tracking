import { useState, useEffect } from "react";
import { useFilterOptions } from "./useFilterOptions";
import { EmployeeAnalytics, DateMode, FilterState, ExchangeAnalytics } from "../types";

export const useExchangeData = () => {
  const [data, setData] = useState<EmployeeAnalytics[]>([]);
  const [exchangeData, setExchangeData] = useState<ExchangeAnalytics[]>([]);
  const [filteredData, setFilteredData] = useState<ExchangeAnalytics[]>([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    role: "",
    type: "",
    region: "",
    exchange: ""
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
          type: filters.type
        })
      });
      const result = await res.json();
      setExchangeData(result);
      setData([]);
    } catch (error) {
      console.error("Failed to fetch exchange data:", error);
      setExchangeData([]);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredData(
      exchangeData.filter(
        (item) =>
          (!filters.region || item.region === filters.region) &&
          (!filters.exchange || item.exchange === filters.exchange)
      )
    );
  }, [filters, exchangeData]);

  return {
    data,
    exchangeData,
    filteredData,
    loading,
    filterLoading,
    filters,
    setFilters,
    filterOptions,
    fetchData
  };
};
