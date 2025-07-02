import { EmployeeAnalytics } from "../../types";
import DataTable, { ColumnConfig } from "./DataTable";

export default function EmployeeTable({
  data,
  totalCount,
  rangeMode
}: {
  data: EmployeeAnalytics[];
  totalCount: number;
  rangeMode: boolean;
}) {
  const columns: ColumnConfig<EmployeeAnalytics>[] = [
    {
      key: "epi",
      label: "EPI",
      sortable: true,
      link: (row) => `/detail/${row.epi}`
    },
    { key: "name", label: "Name", sortable: true },
    {
      key: "entryCount",
      label: "DDS Count",
      sortable: true,
      bgColor: () => "bg-purple-600/20 text-purple-300"
    },
    {
      key: "absent",
      label: "Missing",
      sortable: true,
      bgColor: (row) =>
        row.absent && row.absent > 0
          ? "bg-red-600/20 text-red-300"
          : "bg-green-600/20 text-green-300",
      showWhen: () => rangeMode
    },
    {
      key: "min",
      label: "Min",
      sortable: true,
      bgColor: () => "bg-gray-600/40",
      showWhen: () => rangeMode
    },
    {
      key: "avg",
      label: "Avg",
      sortable: true,
      render: (row) => row.avg?.toFixed(0),
      bgColor: () => "bg-gray-600/40",
      showWhen: () => rangeMode
    },
    {
      key: "max",
      label: "Max",
      sortable: true,
      bgColor: () => "bg-gray-600/40",
      showWhen: () => rangeMode
    },
    {
      key: "monthToDateCompleted",
      label: "MTD Orders Completed",
      sortable: true,
      bgColor: () => "bg-green-800/40",
      render: (row) => row.monthToDateCompleted ?? 0
    },
    {
      key: "monthToDatePaid",
      label: "MTD Orders Paid",
      sortable: true,
      bgColor: () => "bg-green-400/40",
      render: (row) => row.monthToDatePaid ?? 0
    },
    {
      key: "monthToDateGenerated",
      label: "MTD Orders Generated",
      sortable: true,
      bgColor: () => "bg-yellow-600/40",
      render: (row) => row.monthToDateGenerated ?? 0
    },
    {
      key: "lastMonthPaid",
      label: "Orders Paid Last Month",
      sortable: true,
      bgColor: () => "bg-blue-600/40",
      render: (row) => row.lastMonthPaid ?? 0
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      bgColor: (row) => {
        switch (row.role) {
          case "FSA":
            return "bg-blue-600 text-white";
          case "TSA":
            return "bg-pink-500 text-white";
          case "FFO":
            return "bg-purple-600 text-white";
          default:
            return "bg-slate-600 text-white";
        }
      }
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      bgColor: (row) => {
        switch (row.type) {
          case "OSP":
            return "bg-orange-500 text-white";
          case "REG":
            return "bg-green-800 text-white";
          default:
            return "bg-slate-600 text-white";
        }
      }
    },
    { key: "exchange", label: "Exchange", sortable: true },
    { key: "region", label: "Region", sortable: true }
  ];

  return (
    <DataTable<EmployeeAnalytics>
      title="Employee Data"
      data={data}
      columns={columns}
      totalCount={totalCount}
      filename="employees.xlsx"
      sheetName="Employees"
    />
  );
}
