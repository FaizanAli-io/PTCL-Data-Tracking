import { useState, useEffect } from "react";
import { EmployeeAnalytics, DateMode, FilterState, ExchangeAnalytics } from "../types";

export const useExchangeData = () => {
  const [data, setData] = useState<EmployeeAnalytics[]>([]);
  const [exchangeData, setExchangeData] = useState<ExchangeAnalytics[]>([]);
  const [filteredData, setFilteredData] = useState<ExchangeAnalytics[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    role: "",
    type: "",
    region: "",
    exchange: ""
  });
  const [filterOptions, setFilterOptions] = useState({
    roles: [] as string[],
    types: [] as string[],
    regions: [] as string[],
    exchanges: [] as string[]
  });

  // Fetch filter options from API
  const fetchFilterOptions = async () => {
    setFilterLoading(true);
    try {
      const res = await fetch("/api/report/enum-values");
      const result = await res.json();
      if (result.success) {
        setFilterOptions(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch filter options:", error);
    } finally {
      setFilterLoading(false);
    }
  };

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
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setFilteredData(
      exchangeData.filter(
        (item) =>
          (filters.region ? item.region === filters.region : true) &&
          (filters.exchange ? item.exchange === filters.exchange : true)
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
    fetchData,
    refreshFilters: fetchFilterOptions
  };
};
