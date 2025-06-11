// types/index.ts
export type ReportItem = {
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

export type DateMode = "date" | "range";

export type FilterState = {
  role: string;
  type: string;
  region: string;
  exchange: string;
};

export type ExchangeAnalytics = {
  exchange: string;
  totalEmployees: number;
  avgEntryCount: number;
  totalEntries: number;
  totalAbsent: number;
  avgPerformance: number;
  topPerformer: string;
  regions: string[];
};
