export type DateMode = "date" | "range";

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
  entryCount: number;
  avg?: number;
  min?: number;
  max?: number;
  absent?: number;
};

export type ExchangeAnalytics = {
  exchange: string;
  region: string;
  headcount: number;
  min: number;
  max: number;
  avg: number;
  total: number;
  absent: number;
};
