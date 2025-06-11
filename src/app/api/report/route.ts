import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

interface EmployeeReport {
  epi: string;
  name: string;
  role: string;
  type: string;
  region: string;
  exchange: string;
  joinDate: string;
  entryCount: number;
}

export async function GET(_req: NextRequest) {
  try {
    const employees = await prisma.employee.findMany();

    const fsaEpis = employees.filter((emp) => emp.role === "FSA").map((emp) => emp.epi);
    const tsaEpis = employees.filter((emp) => emp.role === "TSA").map((emp) => emp.epi);

    const [fsaCounts, tsaCounts] = await Promise.all([
      fsaEpis.length > 0
        ? prisma.fSA.groupBy({
            by: ["epi"],
            where: { epi: { in: fsaEpis } },
            _count: { epi: true }
          })
        : [],
      tsaEpis.length > 0
        ? prisma.tSA.groupBy({
            by: ["epi"],
            where: { epi: { in: tsaEpis } },
            _count: { epi: true }
          })
        : []
    ]);

    const fsaCountMap = new Map(fsaCounts.map((item) => [item.epi, Number(item._count.epi)]));
    const tsaCountMap = new Map(tsaCounts.map((item) => [item.epi, Number(item._count.epi)]));

    const report: EmployeeReport[] = employees.map((emp) => {
      let count =
        emp.role === "FSA"
          ? fsaCountMap.get(emp.epi) || 0
          : emp.role === "TSA"
          ? tsaCountMap.get(emp.epi) || 0
          : 0;

      return {
        epi: emp.epi.toString(),
        name: emp.name,
        role: emp.role,
        type: emp.type,
        region: emp.region,
        exchange: emp.exchange,
        joinDate: emp.joinDate.toISOString(),
        entryCount: count
      };
    });

    report.sort((a, b) => b.entryCount - a.entryCount);
    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("Error generating employee report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
