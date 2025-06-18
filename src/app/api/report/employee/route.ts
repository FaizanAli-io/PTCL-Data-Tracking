import { prisma, formatEnum } from "@/lib";
import { NextRequest, NextResponse } from "next/server";

const getDateConditions = (dateMode: boolean, startDate: string, endDate?: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate || startDate);

  if (dateMode) {
    const dayStart = new Date(start);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(start);
    dayEnd.setHours(23, 59, 59, 999);

    return {
      createdAt: {
        gte: dayStart,
        lte: dayEnd
      }
    };
  }

  return {
    createdAt: {
      gte: new Date(start.setHours(0, 0, 0, 0)),
      lte: new Date(end.setHours(23, 59, 59, 999))
    }
  };
};

const computeEmployeeStats = (entries: { epi: string; createdAt: Date }[]) => {
  const statsMap = new Map<
    string,
    { entryCount: number; cnt: number; avg: number; min: number; max: number }
  >();

  const groupedByEpiAndDay = entries.reduce((acc, { epi, createdAt }) => {
    const day = createdAt.toISOString().split("T")[0];
    if (!acc.has(epi)) acc.set(epi, new Map<string, number>());
    const dayMap = acc.get(epi)!;
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
    return acc;
  }, new Map<string, Map<string, number>>());

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
    const dateMode = ["yesterday", "today", "custom-date"].includes(mode);

    const employees = await prisma.employee.findMany({
      select: { epi: true, name: true, role: true, type: true, region: true, exchange: true },
      where: { NOT: { role: "MGT", type: "MGT" } }
    });

    const epis = employees.map((e) => e.epi);

    const paidOrders = await prisma.paidOrders.findMany({
      where: { epi: { in: epis } },
      select: { epi: true, orderCount: true }
    });

    const orderCountMap = new Map(paidOrders.map((p) => [p.epi, p.orderCount]));

    const [fsaEntries, tsaEntries] = await Promise.all([
      prisma.fSA.findMany({
        where: {
          epi: { in: epis },
          ...getDateConditions(dateMode, startDate, endDate)
        },
        select: { epi: true, createdAt: true }
      }),
      prisma.tSA.findMany({
        where: {
          epi: { in: epis },
          ...getDateConditions(dateMode, startDate, endDate)
        },
        select: { epi: true, createdAt: true }
      })
    ]);

    const allEntries = [...fsaEntries, ...tsaEntries];
    const statsMap = computeEmployeeStats(allEntries);

    const report = employees.map((emp) => {
      const stats = statsMap.get(emp.epi) || {
        entryCount: 0,
        cnt: 0,
        avg: 0,
        min: 0,
        max: 0
      };

      const absent = !dateMode && workingDays != null ? Math.max(0, workingDays - stats.cnt) : 0;

      return {
        ...emp,
        absent,
        epi: emp.epi,
        avg: stats.avg,
        min: stats.min,
        max: stats.max,
        entryCount: stats.entryCount,
        region: formatEnum(emp.region),
        exchange: formatEnum(emp.exchange),
        orderCount: orderCountMap.get(emp.epi) ?? 0
      };
    });

    report.sort((a, b) => b.entryCount - a.entryCount);
    return NextResponse.json(report, { status: 200 });
  } catch (e) {
    console.error("Error generating report:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
