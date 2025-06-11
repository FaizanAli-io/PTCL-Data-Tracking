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
            select: {
              epi: true,
              createdAt: true
            }
          })
        : [];

    const tsaEntries =
      tsaEpis.length > 0
        ? await prisma.tSA.findMany({
            where:
              mode === "date"
                ? { epi: { in: tsaEpis }, createdAt: new Date(date) }
                : { epi: { in: tsaEpis }, createdAt: { gte: new Date(from), lte: new Date(to) } },
            select: {
              epi: true,
              createdAt: true
            }
          })
        : [];

    console.log(fsaEntries.length);

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

    const report = employees.map((emp) => {
      const stats = entryMap.get(emp.epi) || {
        entryCount: 0,
        cnt: 0,
        avg: 0,
        min: 0,
        max: 0
      };
      const absent = mode === "range" && workingDays != null ? workingDays - stats.cnt : 0;

      return {
        epi: Number(emp.epi),
        name: emp.name,
        role: emp.role,
        type: emp.type,
        region: emp.region,
        exchange: emp.exchange,
        joinDate: emp.joinDate.toISOString(),
        entryCount: stats.entryCount,
        avg: stats.avg,
        min: stats.min,
        max: stats.max,
        absent: absent
      };
    });

    report.sort((a, b) => b.entryCount - a.entryCount);
    return NextResponse.json(report, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
