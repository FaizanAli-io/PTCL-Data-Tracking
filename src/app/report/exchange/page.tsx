"use client";

import { useState } from "react";
import { DateMode } from "../types";
import { Building2 } from "lucide-react";
import { formatDate, addDays } from "../utils/dateUtils";
import { useExchangeData } from "../hooks/useExchangeData";

import PageHeader from "../components/ui/PageHeader";
import ExchangeTable from "../components/tables/ExchangeTable";
import ExchangeSummaryCards from "../components/ui/ExchangeSummaryCards";
import ExchangeReportControlsPanel from "../components/controls/ExchangeReportControlsPanel";

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
  const topRegion =
    filteredData.length > 0
      ? Object.entries(
          filteredData.reduce((acc, ex) => {
            acc[ex.region] = (acc[ex.region] || 0) + ex.total;
            return acc;
          }, {} as Record<string, number>)
        ).sort((a, b) => b[1] - a[1])[0][0]
      : "N/A";

  const topExchange =
    filteredData.length > 0
      ? filteredData.reduce((top, ex) => (ex.total > top.total ? ex : top)).exchange
      : "N/A";

  const totalRegions = new Set(filteredData.flatMap((ex) => ex.region)).size;

  const totalExchanges = filteredData.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          icon={Building2}
          title="Exchange Analytics Dashboard"
          subtitle="Analyze performance metrics across different exchanges"
        />

        <ExchangeSummaryCards
          topRegion={topRegion}
          topExchange={topExchange}
          totalRegions={totalRegions}
          totalExchanges={totalExchanges}
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
