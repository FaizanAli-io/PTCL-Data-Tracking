export type DateMode = "yesterday" | "today" | "mtd" | "ytd" | "custom-date" | "custom-range";

export type FilterState = {
  role: string;
  type: string;
  region: string;
  exchange: string;
};

export type EmployeeAnalytics = {
  epi: number;
  name: string;
  role: string;
  type: string;
  region: string;
  exchange: string;
  joinDate: string;
  orderCount: number;
  entryCount: number;
  avg?: number;
  min?: number;
  max?: number;
  absent?: number;
};

export type ExchangeAnalytics = {
  region: string;
  exchange: string;
  orderCount: number;
  headCount: number;
  missing: number;
  min: number;
  max: number;
  avg: number;
};
