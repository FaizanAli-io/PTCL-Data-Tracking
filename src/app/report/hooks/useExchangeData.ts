import { useState, useEffect } from "react";
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
          date: startDate,
          from: startDate,
          to: endDate,
          workingDays
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
          (filters.exchange ? item.exchange === filters.exchange : true) &&
          (filters.region ? item.region.includes(filters.region) : true)
      )
    );
  }, [filters, exchangeData]);

  const filterOptions = {
    regions: Array.from(new Set(data.map((d) => d.region))),
    exchanges: Array.from(new Set(data.map((d) => d.exchange)))
  };

  return {
    data,
    exchangeData,
    filteredData,
    loading,
    filters,
    setFilters,
    filterOptions,
    fetchData
  };
};
