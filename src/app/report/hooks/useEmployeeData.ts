import { useState, useEffect } from "react";
import { EmployeeAnalytics, DateMode, FilterState } from "../types";

export const useEmployeeData = () => {
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(false);
  const [data, setData] = useState<EmployeeAnalytics[]>([]);
  const [filteredData, setFilteredData] = useState<EmployeeAnalytics[]>([]);
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

  const fetchFilterOptions = async () => {
    setFilterLoading(true);
    try {
      const res = await fetch("/api/report/filter-values");
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
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter(
        (item) =>
          (filters.role ? item.role === filters.role : true) &&
          (filters.type ? item.type === filters.type : true) &&
          (filters.region ? item.region === filters.region : true) &&
          (filters.exchange ? item.exchange === filters.exchange : true)
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
    fetchData,
    refreshFilters: fetchFilterOptions
  };
};
