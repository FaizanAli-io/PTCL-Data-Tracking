"use client";

import { DateMode } from "../types";
import { useState, useEffect } from "react";
import { formatDate, addDays } from "../utils/dateUtils";
import { useExchangeData } from "../hooks/useExchangeData";
import { Building2, MapPin, Award, TrendingUp } from "lucide-react";

import PageHeader from "../components/ui/PageHeader";
import SummaryCards from "../components/ui/SummaryCards";
import ExchangeTable from "../components/tables/ExchangeTable";
import ReportControlsPanel from "../components/controls/ReportControlsPanel";
import PermissionGate from "@/components/PermissionGate";

export default function ExchangeAnalyticsPage() {
  const { data, loading, filters, setFilters, filterOptions, fetchData } = useExchangeData();

  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(addDays(new Date(), 1)));
  const [workingDays, setWorkingDays] = useState<number>(0);
  const [mode, setMode] = useState<DateMode>("today");

  const [autoRefresh, setAutoRefresh] = useState(false);

  const refreshRate = 30;

  const handleFetchData = () => {
    fetchData(mode, startDate, endDate, workingDays);
    setAutoRefresh(true);
  };

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(
      () => fetchData(mode, startDate, endDate, workingDays),
      refreshRate * 1000
    );

    return () => clearInterval(interval);
  }, [autoRefresh, mode, startDate, endDate, workingDays, fetchData]);

  // Summary stats
  const totalExchanges = data.length;

  const bestExchange = data.reduce(
    (best, current) => (current.avg > best.avg ? current : best),
    data[0]
  );

  const regionMap = new Map<string, { total: number; count: number }>();
  for (const ex of data) {
    if (!regionMap.has(ex.region)) regionMap.set(ex.region, { total: 0, count: 0 });
    const r = regionMap.get(ex.region)!;
    r.total += ex.avg;
    r.count += 1;
  }

  let bestRegion = "";
  let bestRegionAvg = -Infinity;
  for (const [region, { total, count }] of regionMap.entries()) {
    const avg = total / count;
    if (avg > bestRegionAvg) {
      bestRegion = region;
      bestRegionAvg = avg;
    }
  }

  const totalRegions = regionMap.size;

  const exchangeStats = [
    {
      icon: Building2,
      color: "text-purple-400",
      label: "Total Exchanges",
      value: totalExchanges,
      description: "Active locations"
    },
    {
      icon: MapPin,
      color: "text-cyan-400",
      label: "Total Regions",
      value: totalRegions,
      description: "Regions represented"
    },
    {
      icon: TrendingUp,
      color: "text-pink-400",
      label: "Best Exchange",
      value: bestExchange?.exchange ?? "-",
      description: `Averaging ${bestExchange?.avg.toFixed(2) ?? "0"} entries`
    },
    {
      icon: Award,
      color: "text-orange-400",
      label: "Best Region",
      value: bestRegion,
      description: `Averaging ${bestRegionAvg.toFixed(2)} entries`
    }
  ];

  return (
    <PermissionGate minLevel={1}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PageHeader
            icon={Building2}
            title="Exchange Analytics Dashboard"
            subtitle="Performance metrics across different exchanges"
          />

          <SummaryCards items={exchangeStats} columns={4} className="mb-6" />

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
            exchangeView={true}
          />

          <ExchangeTable
            data={data}
            totalCount={data.length}
            rangeMode={["mtd", "ytd", "custom-range"].includes(mode)}
          />
        </div>
      </div>
    </PermissionGate>
  );
}
