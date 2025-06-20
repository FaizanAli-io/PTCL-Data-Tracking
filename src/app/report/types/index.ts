export type DateMode = "yesterday" | "today" | "mtd" | "ytd" | "custom-date" | "custom-range";

export type FilterState = {
  role: string;
  type: string;
  region: string;
  exchange: string;
};

type ordersInfo = {
  lastMonthPaid: number;
  monthToDatePaid: number;
  monthToDateGenerated: number;
};

export type EmployeeAnalytics = {
  epi: number;
  name: string;
  role: string;
  type: string;
  region: string;
  exchange: string;
  joinDate: string;
  entryCount: number;
  ordersInfo: ordersInfo;
  avg?: number;
  min?: number;
  max?: number;
  absent?: number;
};

export type ExchangeAnalytics = {
  region: string;
  exchange: string;
  ordersInfo: ordersInfo;
  efficiency: number;
  headCount: number;
  missing: number;
  min: number;
  max: number;
  avg: number;
};
