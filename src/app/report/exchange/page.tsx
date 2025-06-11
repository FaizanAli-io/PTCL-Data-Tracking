"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import { DateMode } from "../types";
import { formatDate, addDays } from "../utils/dateUtils";
import { useExchangeData } from "../hooks/useExchangeData";
import PageHeader from "../components/ui/PageHeader";
import ExchangeSummaryCards from "../components/ui/ExchangeSummaryCards";
import ExchangeReportControlsPanel from "../components/controls/ExchangeReportControlsPanel";
import ExchangeTable from "../components/tables/ExchangeTable";

export default function ExchangeAnalyticsPage() {
  const { exchangeData, filteredData, loading, filters, setFilters, filterOptions, fetchData } =
    useExchangeData();

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(addDays(new Date(), 1)));
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [mode, setMode] = useState<DateMode>("date");

  const handleFetchData = () => {
    fetchData(mode, startDate, endDate, workingDays);
  };

  // Calculate summary stats
  const totalExchanges = filteredData.length;
  const avgPerformance =
    filteredData.length > 0
      ? (
          filteredData.reduce((sum, ex) => sum + ex.avgPerformance, 0) / filteredData.length
        ).toFixed(1)
      : 0;
  const topExchange =
    filteredData.length > 0
      ? filteredData.reduce((top, ex) => (ex.avgPerformance > top.avgPerformance ? ex : top))
          .exchange
      : "N/A";
  const totalRegions = new Set(filteredData.flatMap((ex) => ex.regions)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          icon={Building2}
          title="Exchange Analytics Dashboard"
          subtitle="Analyze performance metrics across different exchanges"
        />

        <ExchangeSummaryCards
          totalExchanges={totalExchanges}
          avgPerformance={avgPerformance}
          topExchange={topExchange}
          totalRegions={totalRegions}
        />

        <ExchangeReportControlsPanel
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

        <ExchangeTable data={filteredData} totalCount={exchangeData.length} />
      </div>
    </div>
  );
}
