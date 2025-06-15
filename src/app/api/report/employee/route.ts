import { prisma, formatEnum } from "@/lib";
import { X } from "lucide-react";
import { NextRequest, NextResponse } from "next/server";

// Helper function to process date ranges
const getDateConditions = (mode: string, startDate: string, endDate?: string) => {
  return mode === "date"
    ? { createdAt: new Date(startDate) }
    : {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate || startDate)
        }
      };
};

// Helper function to compute statistics
const computeEmployeeStats = (entries: { epi: string; createdAt: Date }[]) => {
  const statsMap = new Map<
    string,
    { entryCount: number; cnt: number; avg: number; min: number; max: number }
  >();

  // Group entries by EPI and day
  const groupedByEpiAndDay = entries.reduce((acc, { epi, createdAt }) => {
    const day = createdAt.toISOString().split("T")[0];
    if (!acc.has(epi)) acc.set(epi, new Map<string, number>());
    const dayMap = acc.get(epi)!;
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
    return acc;
  }, new Map<string, Map<string, number>>());

  // Calculate statistics for each employee
  groupedByEpiAndDay.forEach((dayMap, epi) => {
    const counts = Array.from(dayMap.values());
    const sum = counts.reduce((a, b) => a + b, 0);
    const cnt = dayMap.size;
    const avg = sum / cnt;
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    statsMap.set(epi, { entryCount: sum, cnt, avg, min, max });
  });

  return statsMap;
};

export async function POST(req: NextRequest) {
  try {
    const { mode, startDate, endDate, workingDays } = await req.json();
    const dateMode = ["yesterday", "today", "custom-date"].includes(mode) ? "date" : "range";

    // Fetch all employees and group by role in a single query
    const employees = await prisma.employee.findMany({
      select: {
        epi: true,
        name: true,
        role: true,
        type: true,
        region: true,
        exchange: true,
        joinDate: true
      }
    });

    // Get EPIs by role
    const roleEpis = employees.reduce((acc, emp) => {
      if (!acc[emp.role]) acc[emp.role] = [];
      acc[emp.role].push(emp.epi);
      return acc;
    }, {} as Record<string, string[]>);

    // Process FSA and TSA entries in parallel
    const [fsaEntries, tsaEntries] = await Promise.all([
      roleEpis["FSA"]?.length
        ? prisma.fSA.findMany({
            where: {
              epi: { in: roleEpis["FSA"] },
              ...getDateConditions(dateMode, startDate, endDate)
            },
            select: { epi: true, createdAt: true }
          })
        : [],
      roleEpis["TSA"]?.length
        ? prisma.tSA.findMany({
            where: {
              epi: { in: roleEpis["TSA"] },
              ...getDateConditions(dateMode, startDate, endDate)
            },
            select: { epi: true, createdAt: true }
          })
        : []
    ]);

    // Combine all entries and compute statistics
    const allEntries = [...fsaEntries, ...tsaEntries];
    const statsMap = computeEmployeeStats(allEntries);

    // Generate report
    const report = employees.map((emp) => {
      const stats = statsMap.get(emp.epi) || {
        entryCount: 0,
        cnt: 0,
        avg: 0,
        min: 0,
        max: 0
      };

      const absent =
        dateMode === "range" && workingDays != null ? Math.max(0, workingDays - stats.cnt) : 0;

      return {
        ...emp,
        epi: Number(emp.epi),
        joinDate: emp.joinDate.toISOString(),
        entryCount: stats.entryCount,
        avg: stats.avg,
        min: stats.min,
        max: stats.max,
        absent,
        region: emp.region,
        exchange: emp.exchange
      };
    });

    // Sort by entryCount descending
    report
      .sort((a, b) => b.entryCount - a.entryCount)
      .map((x) => ({ ...x, region: formatEnum(x.region), exchange: formatEnum(x.exchange) }));

    return NextResponse.json(report, { status: 200 });
  } catch (e) {
    console.error("Error generating report:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
