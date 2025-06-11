import { useState, useEffect } from "react";
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
        body: JSON.stringify({
          mode,
          date: startDate,
          from: startDate,
          to: endDate,
          workingDays
        })
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
          (filters.role ? item.role === filters.role : true) &&
          (filters.type ? item.type === filters.type : true) &&
          (filters.region ? item.region === filters.region : true) &&
          (filters.exchange ? item.exchange === filters.exchange : true)
      )
    );
  }, [filters, data]);

  const filterOptions = {
    roles: Array.from(new Set(data.map((d) => d.role))),
    types: Array.from(new Set(data.map((d) => d.type))),
    regions: Array.from(new Set(data.map((d) => d.region))),
    exchanges: Array.from(new Set(data.map((d) => d.exchange)))
  };

  return {
    data,
    filteredData,
    loading,
    filters,
    setFilters,
    filterOptions,
    fetchData
  };
};
