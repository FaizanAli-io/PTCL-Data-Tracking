import { Employee } from "@/generated/prisma";

export function formatEnum(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatEmployee(employee: Employee) {
  return {
    ...employee,
    region: formatEnum(employee.region),
    exchange: formatEnum(employee.exchange)
  };
}
