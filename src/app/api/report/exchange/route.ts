import { prisma, formatEnum } from "@/lib";
import { orderFields } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";

type OrderField = (typeof orderFields)[number];

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

const computeExchangeStats = (
  employees: { epi: string; region: string; exchange: string }[],
  entries: { epi: string; createdAt: Date }[],
  dateMode: boolean,
  workingDays: number,
  orderCountMap: Map<string, any>
) => {
  const exchangeMap = new Map<string, { epis: string[]; region: string }>();
  const epiDayMap = new Map<string, Map<string, number>>();

  for (const emp of employees) {
    if (!exchangeMap.has(emp.exchange))
      exchangeMap.set(emp.exchange, { epis: [], region: emp.region });
    exchangeMap.get(emp.exchange)!.epis.push(emp.epi);
  }

  for (const { epi, createdAt } of entries) {
    const day = createdAt.toISOString().split("T")[0];
    if (!epiDayMap.has(epi)) epiDayMap.set(epi, new Map());
    const dayMap = epiDayMap.get(epi)!;
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  }

  workingDays = dateMode ? 1 : workingDays;

  const results = [];
  for (const [exchange, { epis, region }] of exchangeMap.entries()) {
    let missingTotal = 0;
    let averageTotal = 0;
    let minimumTotal = dateMode ? Infinity : 0;
    let maximumTotal = dateMode ? -Infinity : 0;

    let exchangeOrdersInfo: Record<OrderField, number> = Object.fromEntries(
      orderFields.map((key) => [key, 0])
    ) as Record<OrderField, number>;

    for (const epi of epis) {
      const ordersInfo: Record<OrderField, number> = {
        ...Object.fromEntries(orderFields.map((key) => [key, 0])),
        ...(orderCountMap.get(epi) ?? {})
      };

      for (const field of orderFields) {
        exchangeOrdersInfo[field] += ordersInfo[field];
      }

      const dayMap = epiDayMap.get(epi);

      if (!dayMap) {
        missingTotal += workingDays;
        continue;
      }

      const employeeCounts = Array.from(dayMap.values());
      missingTotal += workingDays - dayMap.size;

      if (dateMode) {
        minimumTotal = Math.min(minimumTotal, employeeCounts[0]);
        maximumTotal = Math.max(maximumTotal, employeeCounts[0]);
        averageTotal += employeeCounts[0];
      } else {
        minimumTotal += Math.min(...employeeCounts);
        maximumTotal += Math.max(...employeeCounts);
        averageTotal += employeeCounts.reduce((p, a) => p + a, 0) / employeeCounts.length;
      }
    }

    const headCount = epis.length;
    const missing = missingTotal / (dateMode ? 1 : headCount);
    minimumTotal = minimumTotal == Infinity ? 0 : minimumTotal;
    maximumTotal = maximumTotal == -Infinity ? 0 : maximumTotal;

    results.push({
      region,
      exchange,
      headCount,
      missing,
      ...exchangeOrdersInfo,
      min: minimumTotal / (dateMode ? 1 : headCount),
      max: maximumTotal / (dateMode ? 1 : headCount),
      efficiency: exchangeOrdersInfo.monthToDatePaid / headCount,
      avg: averageTotal / (headCount - (dateMode ? missing : 0) || 1)
    });
  }

  return results.map((x) => ({
    ...x,
    region: formatEnum(x.region),
    exchange: formatEnum(x.exchange)
  }));
};

export async function POST(req: NextRequest) {
  try {
    const { mode, startDate, endDate, workingDays, role, type } = await req.json();
    const dateMode = ["yesterday", "today", "custom-date"].includes(mode);

    const employees = await prisma.employee.findMany({
      select: { epi: true, region: true, exchange: true },
      where: {
        ...(role && { role }),
        ...(type && { type }),
        NOT: {
          OR: [{ role: "MGT" }, { type: "MGT" }]
        }
      }
    });

    const epis = employees.map((e) => e.epi);

    const paidOrders = await prisma.paidOrders.findMany({ where: { epi: { in: epis } } });

    const orderCountMap = new Map(paidOrders.map((p) => [p.epi, p]));

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

    const exchangeStats = computeExchangeStats(
      employees,
      allEntries,
      dateMode,
      workingDays || 1,
      orderCountMap
    );

    return NextResponse.json(exchangeStats, { status: 200 });
  } catch (e) {
    console.error("Error generating exchange stats:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
