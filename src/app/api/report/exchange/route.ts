import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Get Prisma date filter condition
const getDateConditions = (mode: boolean, startDate: string, endDate?: string) => {
  return mode
    ? { createdAt: new Date(startDate) }
    : {
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate || startDate)
        }
      };
};

// Compute exchange-wise statistics
const computeExchangeStats = (
  employees: { epi: bigint; region: string; exchange: string }[],
  entries: { epi: bigint; createdAt: Date }[],
  dateMode: boolean,
  workingDays: number
) => {
  const exchangeMap = new Map<string, { epis: bigint[]; region: string }>();
  const epiDayMap = new Map<bigint, Map<string, number>>();

  // Group employees by exchange
  for (const emp of employees) {
    if (!exchangeMap.has(emp.exchange))
      exchangeMap.set(emp.exchange, { epis: [], region: emp.region });
    exchangeMap.get(emp.exchange)!.epis.push(emp.epi);
  }

  // Count entries per day per employee
  for (const { epi, createdAt } of entries) {
    const day = createdAt.toISOString().split("T")[0];
    if (!epiDayMap.has(epi)) epiDayMap.set(epi, new Map());
    const dayMap = epiDayMap.get(epi)!;
    dayMap.set(day, (dayMap.get(day) || 0) + 1);
  }

  workingDays = dateMode ? 1 : workingDays;

  // Compute stats for each exchange
  const results = [];
  for (const [exchange, { epis, region }] of exchangeMap.entries()) {
    let missingTotal = 0;
    let averageTotal = 0;
    let minimumTotal = dateMode ? Infinity : 0;
    let maximumTotal = dateMode ? -Infinity : 0;

    for (const epi of epis) {
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
      min: minimumTotal / (dateMode ? 1 : headCount),
      max: maximumTotal / (dateMode ? 1 : headCount),
      avg: averageTotal / (headCount - (dateMode ? missing : 0) || 1)
    });
  }

  console.log(results);

  return results.sort((a, b) => b.avg - a.avg);
};

export async function POST(req: NextRequest) {
  try {
    const { mode, startDate, endDate, workingDays, role, type } = await req.json();
    const dateMode = ["yesterday", "today", "custom-date"].includes(mode);

    // Fetch employees with optional role/type filters
    const employees = await prisma.employee.findMany({
      where: {
        ...(role && { role }),
        ...(type && { type })
      },
      select: {
        epi: true,
        region: true,
        exchange: true
      }
    });

    const epis = employees.map((e) => e.epi);

    // Get entries from both FSA and TSA
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

    const exchangeStats = computeExchangeStats(employees, allEntries, dateMode, workingDays || 1);

    return NextResponse.json(exchangeStats, { status: 200 });
  } catch (e) {
    console.error("Error generating exchange stats:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
