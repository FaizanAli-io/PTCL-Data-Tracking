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
        row.missing > 0 ? "bg-red-600/20 text-red-300" : "bg-green-600/20 text-green-300"
    },
    {
      key: "min",
      label: "Min",
      sortable: true,
      bgColor: () => "bg-gray-600/40"
    },
    {
      key: "avg",
      label: "Avg",
      sortable: true,
      render: (row) => row.avg.toFixed(0),
      bgColor: () => "bg-gray-600/40"
    },
    {
      key: "max",
      label: "Max",
      sortable: true,
      bgColor: () => "bg-gray-600/40"
    },
    {
      key: "efficiency",
      label: "Efficiency",
      sortable: true,
      render: (row) => row.efficiency.toFixed(1),
      bgColor: (row) => {
        if (row.efficiency < 5) return "bg-red-600/20 text-red-400";
        if (row.efficiency < 10) return "bg-yellow-600/20 text-yellow-400";
        return "bg-green-600/20 text-green-400";
      }
    },
    {
      key: "monthToDatePaid",
      label: "MTD Orders Paid",
      sortable: true,
      bgColor: () => "bg-green-600/40 text-purple-300"
    },
    {
      key: "monthToDateGenerated",
      label: "MTD Orders Generated",
      sortable: true,
      bgColor: () => "bg-yellow-600/40 text-purple-300"
    },
    {
      key: "lastMonthPaid",
      label: "Orders Paid Last Month",
      sortable: true,
      bgColor: () => "bg-blue-600/40 text-purple-300"
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
