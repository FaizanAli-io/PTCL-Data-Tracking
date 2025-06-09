import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  try {
    const employees = await prisma.employee.findMany();

    const report = await Promise.all(
      employees.map(async (emp) => {
        let count = 0;

        if (emp.role === "FSA") {
          count = await prisma.fSA.count({ where: { epi: emp.epi } });
        } else if (emp.role === "TSA") {
          count = await prisma.tSA.count({ where: { epi: emp.epi } });
        }

        return {
          epi: emp.epi,
          name: emp.name,
          role: emp.role,
          type: emp.type,
          exchange: emp.exchange,
          entryCount: count
        };
      })
    );

    return NextResponse.json(report, { status: 200 });
  } catch (error) {
    console.error("Error generating employee report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
