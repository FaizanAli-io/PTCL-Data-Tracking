"use client";

import { useState } from "react";
import { DateMode } from "../types";
import { formatDate, addDays } from "../utils/dateUtils";
import { useEmployeeData } from "../hooks/useEmployeeData";
import { BarChart3, Users, Clock, UserX } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import SummaryCards from "../components/ui/SummaryCards";
import EmployeeTable from "../components/tables/EmployeeTable";
import ReportControlsPanel from "../components/controls/ReportControlsPanel";

export default function EmployeeAnalyticsPage() {
  const { data, filteredData, loading, filters, setFilters, filterOptions, fetchData } =
    useEmployeeData();

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(addDays(new Date(), 1)));
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [mode, setMode] = useState<DateMode>("today");

  const handleFetchData = () => {
    fetchData(mode, startDate, endDate, workingDays);
  };

  // Calculate summary stats
  const totalEmployees = filteredData.length;

  const missingEmployees = filteredData.reduce(
    (sum, emp) => sum + (emp.entryCount === 0 ? 1 : 0),
    0
  );

  const rangeInput = ["mtd", "ytd", "custom-range"].includes(mode);

  const avgEntryCount = (
    filteredData.reduce((sum, emp) => sum + (emp.avg || 0), 0) /
    (totalEmployees - (rangeInput ? 0 : missingEmployees))
  ).toFixed(1);

  const totalMissing = rangeInput
    ? (filteredData.reduce((sum, emp) => sum + (emp.absent || 0), 0) / totalEmployees).toFixed(1)
    : missingEmployees;

  const employeeStats = [
    {
      icon: Users,
      color: "text-blue-400",
      label: "Total Employees",
      value: totalEmployees,
      description: "Currently active"
    },
    {
      icon: Clock,
      color: "text-green-400",
      label: "Avg. Entries",
      value: isNaN(Number(avgEntryCount)) ? "0.0" : avgEntryCount,
      description: "Per employee"
    },
    {
      icon: UserX,
      color: "text-red-400",
      label: rangeInput ? "Avg. Missing" : "Missing Today",
      value: totalMissing,
      description: rangeInput ? "Per employee" : "No entries"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          icon={BarChart3}
          title="Employee Analytics Dashboard"
          subtitle="Track and analyze employee performance metrics"
        />

        <SummaryCards items={employeeStats} columns={3} className="mb-6" />

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
