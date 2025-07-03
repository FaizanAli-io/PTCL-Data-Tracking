import { ExchangeAnalytics } from "../../types";
import DataTable, { ColumnConfig } from "./DataTable";

export default function ExchangeTable({
  data,
  totalCount,
  rangeMode
}: {
  data: ExchangeAnalytics[];
  totalCount: number;
  rangeMode: boolean;
}) {
  const columns: ColumnConfig<ExchangeAnalytics>[] = [
    {
      key: "exchange",
      label: "Exchange",
      sortable: true,
      bgColor: () => "bg-purple-600/20 text-purple-300"
    },
    {
      key: "headCount",
      label: "Headcount",
      sortable: true,
      bgColor: () => "bg-black text-purple-300"
    },
    {
      key: "missing",
      label: `Missing ${rangeMode ? "Days" : "People"}`,
      sortable: true,
      bgColor: (row) =>
        row.missing > 0 ? "bg-red-600/20 text-red-300" : "bg-green-600/20 text-green-300",
      render: (row) => row.missing.toFixed(0)
    },
    {
      key: "avg",
      label: "Avg",
      sortable: true,
      bgColor: () => "bg-gray-600/40",
      render: (row) => row.avg.toFixed(0)
    },
    {
      sortable: true,
      key: "efficiency",
      label: "Efficiency",
      render: (row) => row.efficiency.toFixed(1),
      bgColor: (row) => {
        if (row.efficiency < 5) return "bg-red-600/20 text-red-400";
        if (row.efficiency < 10) return "bg-yellow-600/20 text-yellow-400";
        return "bg-green-600/20 text-green-400";
      }
    },
    {
      sortable: true,
      key: "monthToDateCompleted",
      label: "MTD Orders Completed",
      bgColor: () => "bg-green-500/30"
    },
    {
      sortable: true,
      key: "monthToDatePaid",
      label: "MTD Orders Paid",
      bgColor: () => "bg-green-600/30"
    },
    {
      sortable: true,
      key: "monthToDateGenerated",
      label: "MTD Orders Generated",
      bgColor: () => "bg-green-700/30"
    },
    {
      sortable: true,
      key: "lastMonthCompleted",
      label: "Last Month Orders Completed",
      bgColor: () => "bg-blue-500/30"
    },
    {
      sortable: true,
      key: "lastMonthPaid",
      label: "Last Month Orders Paid",
      bgColor: () => "bg-blue-600/30"
    },
    {
      key: "region",
      label: "Region",
      sortable: true,
      bgColor: () => "text-white"
    }
  ];

  return (
    <DataTable<ExchangeAnalytics>
      title="Exchange Analytics"
      data={data}
      columns={columns}
      totalCount={totalCount}
      filename="exchange_analytics.xlsx"
      sheetName="Exchanges"
    />
  );
}
