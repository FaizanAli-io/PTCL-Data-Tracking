import { useState, useEffect } from "react";
import { ReportItem, DateMode, FilterState } from "../types";
import { mockData } from "../data/mockData";

export const useEmployeeData = () => {
  const [data, setData] = useState<ReportItem[]>([]);
  const [filteredData, setFilteredData] = useState<ReportItem[]>([]);
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
      let url = "/api/report?";
      if (mode === "date") {
        url += `date=${startDate}`;
      } else {
        url += `from=${startDate}&to=${endDate}&workingDays=${workingDays}`;
      }

      // Simulate API call - replace with actual fetch
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(mockData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Fallback to mock data
      setData(mockData);
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
