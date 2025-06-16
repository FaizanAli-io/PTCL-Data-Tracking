import { useState, useEffect } from "react";
import { useFilterOptions } from "./useFilterOptions";
import { EmployeeAnalytics, DateMode, FilterState } from "../types";

export const useEmployeeData = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EmployeeAnalytics[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeAnalytics[]>([]);
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
      const res = await fetch("/api/report/employee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, startDate, endDate, workingDays })
      });
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredData(
      data.filter(
        (item) =>
          (!filters.role || item.role === filters.role) &&
          (!filters.type || item.type === filters.type) &&
          (!filters.region || item.region === filters.region) &&
          (!filters.exchange || item.exchange === filters.exchange)
      )
    );
  }, [filters, data]);

  return {
    data,
    filteredData,
    loading,
    filterLoading,
    filters,
    setFilters,
    filterOptions,
    fetchData
  };
};
