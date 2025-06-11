import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { mode, date, from, to, workingDays } = await req.json();

    const employees = await prisma.employee.findMany();

    const fsaEpis = employees.filter((e) => e.role === "FSA").map((e) => e.epi);
    const tsaEpis = employees.filter((e) => e.role === "TSA").map((e) => e.epi);

    const fsaEntries =
      fsaEpis.length > 0
        ? await prisma.fSA.findMany({
            where:
              mode === "date"
                ? { epi: { in: fsaEpis }, createdAt: new Date(date) }
                : { epi: { in: fsaEpis }, createdAt: { gte: new Date(from), lte: new Date(to) } },
            select: { epi: true, createdAt: true }
          })
        : [];

    const tsaEntries =
      tsaEpis.length > 0
        ? await prisma.tSA.findMany({
            where:
              mode === "date"
                ? { epi: { in: tsaEpis }, createdAt: new Date(date) }
                : { epi: { in: tsaEpis }, createdAt: { gte: new Date(from), lte: new Date(to) } },
            select: { epi: true, createdAt: true }
          })
        : [];

    const entryMap = new Map<
      bigint,
      { entryCount: number; cnt: number; avg: number; min: number; max: number }
    >();

    const computeStats = (entries: { epi: bigint; createdAt: Date }[]) => {
      const grouped = new Map<bigint, string[]>();
      entries.forEach(({ epi, createdAt }) => {
        const day = createdAt.toISOString().split("T")[0];
        if (!grouped.has(epi)) grouped.set(epi, []);
        grouped.get(epi)!.push(day);
      });

      grouped.forEach((days, epi) => {
        const counts = Object.values(
          days.reduce((acc, d) => {
            acc[d] = (acc[d] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        );
        const sum = counts.reduce((a, b) => a + b, 0);
        const cnt = counts.length;
        const avg = sum / cnt;
        const min = Math.min(...counts);
        const max = Math.max(...counts);
        entryMap.set(epi, { entryCount: sum, cnt, avg, min, max });
      });
    };

    computeStats(fsaEntries);
    computeStats(tsaEntries);

    const exchangeMap = new Map<
      string,
      {
        region: string;
        headcount: number;
        entryCounts: number[];
        total: number;
        absents: number;
      }
    >();

    employees.forEach((emp) => {
      const stats = entryMap.get(emp.epi) || {
        entryCount: 0,
        cnt: 0,
        avg: 0,
        min: 0,
        max: 0
      };
      const absent = mode === "range" && workingDays != null ? workingDays - stats.cnt : 0;

      if (!exchangeMap.has(emp.exchange)) {
        exchangeMap.set(emp.exchange, {
          region: emp.region,
          headcount: 0,
          entryCounts: [],
          total: 0,
          absents: 0
        });
      }

      const ex = exchangeMap.get(emp.exchange)!;
      ex.headcount += 1;
      ex.entryCounts.push(stats.entryCount);
      ex.total += stats.entryCount;
      ex.absents += absent;
    });

    const report = Array.from(exchangeMap.entries()).map(([exchange, data]) => {
      const min = Math.min(...data.entryCounts);
      const max = Math.max(...data.entryCounts);
      const avg = data.total / data.entryCounts.length;

      return {
        exchange,
        region: data.region,
        headcount: data.headcount,
        min,
        max,
        avg,
        total: data.total,
        absent: data.absents
      };
    });

    return NextResponse.json(
      report
        .sort((a, b) => b.total - a.total)
        .map((a) => ({ ...a, region: a.region.replace(/_/g, "-") }))
        .map((a) => ({ ...a, exchange: a.exchange.replace(/_/g, " ") })),
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
