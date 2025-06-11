import { useState, useEffect } from "react";
import { EmployeeAnalytics, DateMode, FilterState, ExchangeAnalytics } from "../types";
import { mockData } from "../data/mockData";

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

  const processExchangeData = (employeeData: EmployeeAnalytics[]): ExchangeAnalytics[] => {
    const exchangeMap = new Map<string, EmployeeAnalytics[]>();

    // Group employees by exchange
    employeeData.forEach((emp) => {
      if (!exchangeMap.has(emp.exchange)) {
        exchangeMap.set(emp.exchange, []);
      }
      exchangeMap.get(emp.exchange)!.push(emp);
    });

    // Calculate analytics for each exchange
    return Array.from(exchangeMap.entries())
      .map(([exchange, employees]) => {
        const totalEmployees = employees.length;
        const totalEntries = employees.reduce((sum, emp) => sum + emp.entryCount, 0);
        const avgEntryCount = totalEntries / totalEmployees;
        const totalAbsent = employees.reduce((sum, emp) => sum + (emp.absent || 0), 0);
        const avgPerformance =
          employees.reduce((sum, emp) => sum + (emp.avg || 0), 0) / totalEmployees;

        // Find top performer
        const topPerformer = employees.reduce((top, emp) =>
          (emp.avg || 0) > (top.avg || 0) ? emp : top
        ).name;

        // Get unique regions
        const regions = Array.from(new Set(employees.map((emp) => emp.region)));

        return {
          exchange,
          totalEmployees,
          avgEntryCount,
          totalEntries,
          totalAbsent,
          avgPerformance,
          topPerformer,
          regions
        };
      })
      .sort((a, b) => b.avgPerformance - a.avgPerformance); // Sort by performance
  };

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
      const processedData = processExchangeData(mockData);
      setExchangeData(processedData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      // Fallback to mock data
      setData(mockData);
      const processedData = processExchangeData(mockData);
      setExchangeData(processedData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setFilteredData(
      exchangeData.filter(
        (item) =>
          (filters.exchange ? item.exchange === filters.exchange : true) &&
          (filters.region ? item.regions.includes(filters.region) : true)
      )
    );
  }, [filters, exchangeData]);

  const filterOptions = {
    roles: [], // Not applicable for exchange view
    types: [], // Not applicable for exchange view
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
