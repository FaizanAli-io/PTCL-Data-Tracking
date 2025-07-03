export type OrderData = {
  lastMonthPaid: number | null;
  lastMonthCompleted: number | null;
  monthToDateGenerated: number | null;
  monthToDatePaid: number | null;
  monthToDateCompleted: number | null;
};

export const orderFields: (keyof OrderData)[] = [
  "lastMonthPaid",
  "lastMonthCompleted",
  "monthToDateGenerated",
  "monthToDatePaid",
  "monthToDateCompleted"
];
