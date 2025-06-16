import { NextRequest, NextResponse } from "next/server";
import { prisma, formatEmployee } from "@/lib";

export async function GET(request: NextRequest, { params }: { params: Promise<{ epi: string }> }) {
  const { epi } = await params;
  const dateStr = new URL(request.url).searchParams.get("date");

  if (!epi || !dateStr) {
    return NextResponse.json(
      { error: "Invalid 'epi' or missing 'date' parameter" },
      { status: 400 }
    );
  }

  const employee = await prisma.employee.findFirst({ where: { epi } });

  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid 'date' parameter" }, { status: 400 });
  }

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const criteria = { epi: employee.epi, createdAt: { gte: startOfDay, lt: endOfDay } };
  const handler = ["FSA", "FFO", "MGT"].includes(employee.role)
    ? () => prisma.fSA.findMany({ where: criteria })
    : () => prisma.tSA.findMany({ where: criteria });

  const entries = await handler();
  entries.reverse();

  return NextResponse.json({ employee: formatEmployee(employee), date: dateStr, entries });
}
