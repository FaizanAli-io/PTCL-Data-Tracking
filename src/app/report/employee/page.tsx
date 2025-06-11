"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { DateMode } from "../types";
import { formatDate, addDays } from "../utils/dateUtils";
import { useEmployeeData } from "../hooks/useEmployeeData";
import PageHeader from "../components/ui/PageHeader";
import SummaryCards from "../components/ui/SummaryCards";
import ReportControlsPanel from "../components/controls/ReportControlsPanel";
import EmployeeTable from "../components/tables/EmployeeTable";

export default function EmployeeAnalyticsPage() {
  const { data, filteredData, loading, filters, setFilters, filterOptions, fetchData } =
    useEmployeeData();

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(addDays(new Date(), 1)));
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [mode, setMode] = useState<DateMode>("date");

  const handleFetchData = () => {
    fetchData(mode, startDate, endDate, workingDays);
  };

  // Calculate summary stats
  const totalEmployees = filteredData.length;
  const avgEntryCount =
    filteredData.length > 0
      ? (filteredData.reduce((sum, emp) => sum + emp.entryCount, 0) / filteredData.length).toFixed(
          1
        )
      : 0;
  const totalAbsent =
    mode === "range" ? filteredData.reduce((sum, emp) => sum + (emp.absent || 0), 0) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          icon={BarChart3}
          title="Employee Analytics Dashboard"
          subtitle="Track and analyze employee performance metrics"
        />

        <SummaryCards
          totalEmployees={totalEmployees}
          avgEntryCount={avgEntryCount}
          totalAbsent={totalAbsent}
        />

        <ReportControlsPanel
          mode={mode}
          setMode={setMode}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          workingDays={workingDays}
          setWorkingDays={setWorkingDays}
          loading={loading}
          onFetchData={handleFetchData}
          filters={filters}
          setFilters={setFilters}
          filterOptions={filterOptions}
        />

        <EmployeeTable data={filteredData} totalCount={data.length} mode={mode} />
      </div>
    </div>
  );
}
