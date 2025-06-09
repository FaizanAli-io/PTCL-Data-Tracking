import { PrismaClient } from "@/generated/prisma";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(_req: NextRequest) {
  const employees = await prisma.employee.findMany();

  const report = await Promise.all(
    employees.map(async (emp) => {
      const count =
        emp.role === "FSA"
          ? await prisma.fSA.count({ where: { epi: emp.epi } })
          : emp.role === "TSA"
          ? await prisma.tSA.count({ where: { epi: emp.epi } })
          : 0;

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

  return new Response(JSON.stringify(report), { status: 200 });
}
